/**
 * Amorçage V1 — crée UNIQUEMENT ce que le brief énonce explicitement :
 * Dominique comme personne/administrateur, et les domaines/sous-domaines
 * nommés dans la maquette, en type "À classifier". Aucun rôle, pourcentage,
 * revenu ou décision n'est inventé (spec §"Contrat d'implémentation", règle
 * de contenu du message d'autorisation).
 *
 * Usage :
 *   npm run seed              (contre les émulateurs locaux)
 *   npm run seed -- --prod    (contre un vrai projet Firebase — confirmation requise)
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { randomUUID } from "crypto";

const USE_EMULATOR = !process.argv.includes("--prod");
if (USE_EMULATOR) {
  process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";
  console.log("→ Amorçage contre les émulateurs Firebase locaux.\n");
} else {
  console.log("→ Amorçage contre un PROJET FIREBASE RÉEL.\n");
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "studio-dev";

if (!getApps().length) {
  if (USE_EMULATOR) {
    // Aucune créance réelle requise pour parler aux émulateurs locaux.
    initializeApp({ projectId });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)), projectId });
  } else {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY est requis pour amorcer un vrai projet Firebase.");
  }
}

const auth = getAuth();
const db = getFirestore();
const WORKSPACE_ID = process.env.STUDIO_WORKSPACE_ID ?? "studio-dominique-soucy";

const now = new Date().toISOString();

async function upsertAuthUser(email: string, password: string, displayName: string) {
  try {
    const existing = await auth.getUserByEmail(email);
    return existing;
  } catch {
    return auth.createUser({ email, password, displayName, emailVerified: true });
  }
}

async function createEntity(params: {
  kind: string;
  exactName: string;
  description?: string | null;
  domainAccent?: string | null;
  createdBy: string;
}) {
  const id = randomUUID();
  const doc = {
    id,
    workspaceId: WORKSPACE_ID,
    kind: params.kind,
    exactName: params.exactName,
    description: params.description ?? null,
    stage: null,
    lifecycleState: "active",
    classificationStatus: params.kind === "unclassified" ? "unclassified" : "classified",
    confirmationStatus: "confirmed",
    operatorPersonId: null,
    nextAction: null,
    domainAccent: params.domainAccent ?? null,
    archivedAt: null,
    version: 1,
    createdAt: now,
    createdBy: params.createdBy,
    updatedAt: now,
    updatedBy: params.createdBy,
  };
  await db.collection("workspaces").doc(WORKSPACE_ID).collection("entities").doc(id).set(doc);
  await db
    .collection("workspaces")
    .doc(WORKSPACE_ID)
    .collection("changeEvents")
    .doc(randomUUID())
    .set({
      id: randomUUID(),
      workspaceId: WORKSPACE_ID,
      actorId: params.createdBy,
      targetId: id,
      targetKind: "entity",
      action: "entity.created",
      summary: `Création de « ${params.exactName} »`,
      recordedAt: now,
      effectiveAt: null,
      before: null,
      after: doc,
    });
  return doc;
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME ?? "Dominique Soucy";
  if (!adminEmail || !adminPassword) {
    throw new Error(
      "SEED_ADMIN_EMAIL et SEED_ADMIN_PASSWORD doivent être définis (voir .env.example)."
    );
  }

  await db.collection("workspaces").doc(WORKSPACE_ID).set(
    { id: WORKSPACE_ID, name: "Studio Dominique Soucy", timezone: "America/Toronto" },
    { merge: true }
  );

  const authUser = await upsertAuthUser(adminEmail, adminPassword, adminName);
  console.log(`Compte admin : ${adminEmail} (uid ${authUser.uid})`);

  const dominique = await createEntity({
    kind: "person",
    exactName: adminName,
    description: "Créateur · Propriétaire · Connecteur",
    createdBy: authUser.uid,
  });

  await db
    .collection("workspaces")
    .doc(WORKSPACE_ID)
    .collection("members")
    .doc(authUser.uid)
    .set({
      id: authUser.uid,
      workspaceId: WORKSPACE_ID,
      displayName: adminName,
      email: adminEmail,
      personId: dominique.id,
      isAdmin: true,
      status: "active",
    });

  // Domaines/sous-domaines explicitement nommés dans la maquette jointe.
  // Type "unclassified" (À classifier) : aucune nature juridique présumée.
  const domains = [
    { name: "PürInstinct", description: "Sport · Games · Clinics · Média · Communauté", accent: "purinstinct" },
    { name: "Ballers Only", description: "Basketball · Communauté · Vêtements · Produits numériques", accent: "ballers" },
    { name: "In Five", description: "App · Family Box · Abonnement", accent: "infive" },
    { name: "Gamification", description: "Sports · Apps · Écoles · Événements · Communauté", accent: "gamification" },
    { name: "Manipule le jeu", description: "L'histoire du DVD — Contenu · Conférence", accent: "default" },
    { name: "Events & Community", description: "Clothing / Cultural Drops", accent: "default" },
  ] as const;

  const created = [];
  for (const domain of domains) {
    const entity = await createEntity({
      kind: "unclassified",
      exactName: domain.name,
      description: domain.description,
      domainAccent: domain.accent,
      createdBy: authUser.uid,
    });
    created.push(entity);
    console.log(`  + ${domain.name}`);
  }

  // Liens de navigation depuis la vue d'ensemble — jamais une preuve de
  // détention (spec, message d'autorisation : "Les liens de la vue
  // d'ensemble sont des liens de navigation, pas des preuves de détention.")
  for (const entity of created) {
    await db
      .collection("workspaces")
      .doc(WORKSPACE_ID)
      .collection("relationships")
      .doc(randomUUID())
      .set({
        id: randomUUID(),
        workspaceId: WORKSPACE_ID,
        fromId: dominique.id,
        toId: entity.id,
        type: "concerns",
        confirmationStatus: "confirmed",
        validFrom: null,
        validTo: null,
        version: 1,
        createdAt: now,
        createdBy: authUser.uid,
        updatedAt: now,
        updatedBy: authUser.uid,
      });
  }

  // Deux vues référençant les mêmes objets — preuve requise pour la
  // première boucle complète (spec §7, critères d'acceptation).
  async function makeView(name: string, entityIds: string[], positions: Record<string, { x: number; y: number }>) {
    const viewId = randomUUID();
    await db.collection("workspaces").doc(WORKSPACE_ID).collection("views").doc(viewId).set({
      id: viewId,
      workspaceId: WORKSPACE_ID,
      ownerId: authUser.uid,
      name,
      rootId: null,
      mode: "real",
      layoutVersion: 1,
      createdAt: now,
      createdBy: authUser.uid,
    });
    for (const entityId of entityIds) {
      const itemId = randomUUID();
      const pos = positions[entityId] ?? { x: 0, y: 0 };
      await db
        .collection("workspaces")
        .doc(WORKSPACE_ID)
        .collection("views")
        .doc(viewId)
        .collection("items")
        .doc(itemId)
        .set({
          id: itemId,
          viewId,
          entityId,
          x: pos.x,
          y: pos.y,
          width: 220,
          height: 120,
          pinned: false,
          version: 1,
          updatedAt: now,
          updatedBy: authUser.uid,
        });
    }
    return viewId;
  }

  const overviewPositions: Record<string, { x: number; y: number }> = {
    [dominique.id]: { x: 480, y: 320 },
  };
  const angleStep = (2 * Math.PI) / created.length;
  created.forEach((entity, i) => {
    overviewPositions[entity.id] = {
      x: 480 + Math.cos(i * angleStep) * 420,
      y: 320 + Math.sin(i * angleStep) * 300,
    };
  });
  const overviewId = await makeView(
    "Vue d'ensemble",
    [dominique.id, ...created.map((e) => e.id)],
    overviewPositions
  );
  console.log(`Vue créée : Vue d'ensemble (${overviewId})`);

  const gamification = created.find((e) => e.exactName === "Gamification")!;
  const detailId = await makeView(
    "Gamification — détail",
    [dominique.id, gamification.id],
    { [dominique.id]: { x: 200, y: 260 }, [gamification.id]: { x: 560, y: 180 } }
  );
  console.log(`Vue créée : Gamification — détail (${detailId})`);

  if (process.env.CREATE_TEST_MEMBER === "true") {
    const testEmail = process.env.SEED_TEST_EMAIL ?? "invite-test@studio.local";
    const testPassword = process.env.SEED_TEST_PASSWORD ?? "test-password-1234";
    const testUser = await upsertAuthUser(testEmail, testPassword, "Collaborateur test");
    await db
      .collection("workspaces")
      .doc(WORKSPACE_ID)
      .collection("members")
      .doc(testUser.uid)
      .set({
        id: testUser.uid,
        workspaceId: WORKSPACE_ID,
        displayName: "Collaborateur test",
        email: testEmail,
        personId: null,
        isAdmin: false,
        status: "active",
      });
    // Droit de lecture explicite sur un seul domaine, pour tester
    // l'absence de fuite sur les autres (aucun droit implicite hérité).
    await db
      .collection("workspaces")
      .doc(WORKSPACE_ID)
      .collection("objectGrants")
      .doc(`entity_${gamification.id}_${testUser.uid}`)
      .set({
        id: `entity_${gamification.id}_${testUser.uid}`,
        workspaceId: WORKSPACE_ID,
        resourceType: "entity",
        resourceId: gamification.id,
        memberId: testUser.uid,
        permission: "read",
      });
    console.log(`\nCompte de test restreint : ${testEmail} / ${testPassword} (lecture sur "Gamification" seulement)`);
  }

  console.log("\nAmorçage terminé.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
