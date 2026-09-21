# Studio Dominique Soucy — V1 (première boucle complète)

Application privée : carte visuelle des initiatives, marques, produits,
personnes, idées, tâches, documents et décisions de Dominique Soucy.
Spécification : voir le MASTER BUILD SPEC fourni en amont. Cette V1 couvre
l'étape 1 du contrat d'implémentation (fondation) et une partie de l'étape 2.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- React Flow (`@xyflow/react`) pour la carte interactive
- **Firebase** (Auth + Firestore) — choix du client, remplace la
  recommandation PostgreSQL/Supabase de la spec. Firestore sert de base de
  données ; aucune donnée métier n'est lue ou écrite directement par le
  client Firestore (voir `firestore.rules` — tout est verrouillé). Toutes
  les lectures/écritures passent par des Server Actions / Route Handlers
  Next.js utilisant le SDK Admin, qui appliquent les droits par objet à
  chaque appel. C'est le point de contrôle unique des permissions.
- Aucun déploiement Vercel pour l'instant (à faire plus tard, par consigne).

## Lancer en local

### 1. Émulateurs Firebase (aucun projet réel requis pour développer)

```bash
npm run emulators
```

Démarre Auth (9099) et Firestore (8080) localement. UI : http://127.0.0.1:4000

### 2. Config locale

Copier `.env.example` en `.env.local` et ajuster si besoin (les valeurs par
défaut fonctionnent avec les émulateurs). Le projet doit être préfixé
`demo-` (`NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-studio-dev`) — c'est la
convention Firebase qui désactive la validation de clé API et garantit
qu'aucune requête ne peut atteindre un vrai projet par erreur.

### 3. Amorçage (Dominique + domaines du brief + 2 vues)

```bash
npm run seed
```

Crée le compte admin (`SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` dans
`.env.local`), la personne « Dominique Soucy », les 6 domaines **exactement
nommés dans la maquette** (PürInstinct, Ballers Only, In Five, Gamification,
Manipule le jeu, Events & Community) en type « À classifier », les liens de
navigation (non juridiques) depuis Dominique vers chacun, et **deux vues
référençant les mêmes objets** (« Vue d'ensemble » et « Gamification —
détail ») — la preuve requise pour la première boucle complète.

Avec `CREATE_TEST_MEMBER=true`, crée aussi un compte restreint
(`invite-test@studio.local`) avec un droit de lecture explicite sur un seul
domaine, pour valider l'absence de fuite.

### 4. Application

```bash
npm run dev
```

http://localhost:3000 → redirige vers `/login`.

## Ce qui fonctionne réellement (vérifié dans un navigateur, pas seulement compilé)

- **Authentification privée** : Firebase Auth (courriel/mot de passe),
  session par cookie httpOnly vérifié côté serveur à chaque requête
  (`verifyIdToken`). Aucune inscription libre.
- **Modèle d'objets + permissions** : entités, relations, vues/occurrences,
  tâches, décisions (avec révisions immuables), journal de changements —
  tables séparées comme l'exige la spec (§5, §7, §13, §19). Droits explicites
  par objet (`objectGrants`), admin bypass, tout le reste refusé par défaut.
- **Carte interactive** (React Flow) : glisser-déposer avec sauvegarde de
  position en fin de déplacement + version attendue, zoom, sélection, tracé
  de connexion → choix du type de relation + statut confirmé/envisagé,
  légende des types de trait, mode Réalité/Vision (Vision affiche aussi les
  relations envisagées, en pointillé).
- **Fiche modifiable** : nom, type, stade, prochaine action, description,
  tâches, décisions (adoption sourcée avec raisonnement optionnel — jamais
  inventé), relations, historique filtré par droits. Contrôle de version
  optimiste : un conflit affiche un bandeau et propose de recharger, sans
  écraser silencieusement.
- **Preuve « deux vues, même objet »** : vérifiée en direct — renommer
  « Gamification » depuis la fiche dans « Vue d'ensemble » met à jour le
  nom dans « Gamification — détail » sans déplacer aucune occurrence.
  (Testé via script Playwright, voir `VIEW2_HAS_RENAME: true` dans les
  vérifications ci-dessous.)
- **« Retirer de cette vue » vs « Archiver l'objet »** : deux actions
  distinctes dans la fiche ; retirer ne supprime que l'occurrence, archiver
  change l'état de l'objet (visible aussi dans les autres vues) et est
  réversible.
- **Recherche** (nom + texte), **Personnes**, **Décisions**, **Changements**
  (filtré par période, deux blocs : changements survenus / points ouverts —
  ce dernier basé sur une règle déterministe d'échéance dépassée, jamais une
  priorité opaque), **À traiter** (tâches ouvertes réelles ; aucune
  proposition IA simulée).
- **Regroupements visuels (cadres)** : dessiner, redimensionner, renommer et
  supprimer des cadres décoratifs sur la carte pour grouper des cartes —
  aucun effet sur la détention, les rôles ou les droits (spec §7). Persistés
  et restaurés après rechargement.
- **Vues enregistrées** : « + Nouvelle vue » (barre latérale) crée une vue
  nommée, avec amorçage optionnel par type d'objet (instantané une fois, pas
  une requête vivante — la mémoire spatiale n'est jamais bouleversée par une
  donnée nouvelle).
- **Filtre d'affichage** sur la carte (par type d'objet, afficher/masquer les
  archivés) — purement visuel, ne touche pas les occurrences enregistrées.
- **Accessibilité clavier** : listes et fiche en éléments sémantiques
  (`<button>`/`<a>`/`<label>`), focus visible global, cartes et cadres du
  canevas ont un nom accessible (`ariaLabel`) et restent atteignables sans
  la carte via la recherche et les listes.
- **Permissions testées avec un second utilisateur restreint** : compte de
  test avec lecture sur un seul domaine → celui-ci n'apparaît ni dans les
  autres vues, ni dans la recherche, ni dans les changements des autres
  objets. Vérifié en navigateur (capture jointe).
- **Responsive** : validé à 1440×900, 768×1024 et 390×844. Sur mobile, la
  navigation devient un tiroir, la fiche devient plein écran, aucun
  débordement horizontal (vérifié programmatiquement).
- **Accessibilité** : champs de formulaire associés à de vrais `<label>`,
  rôles `dialog`/`aria-modal` sur les fenêtres, focus visible (repris des
  tokens), Échap ferme les modales.

## Vérifications effectuées

- `npm run build` : vert (TypeScript strict + génération de routes).
- `npx eslint src` : aucune erreur.
- Revue visuelle en navigateur réel (Playwright + Chromium) à trois largeurs,
  comparée à la maquette (typographie serif/sans, palette ivoire/vert
  profond/noir, cartes à bordure fine, sélection vert profond, panneau
  latéral, barre de capture flottante).
- Répercussion d'une modification entre deux vues sans déplacer les
  occurrences : **confirmé**.
- Utilisateur restreint sans accès aux objets non autorisés (carte, vue,
  recherche) : **confirmé**.
- Persistance après rechargement (Firestore) : **confirmé** (les données
  survivent aux redémarrages du serveur applicatif).
- Cadre créé, renommé, déplacé/redimensionné, retrouvé identique après
  rechargement complet de la page : **confirmé**.
- Vue enregistrée créée avec filtre par type, amorcée avec le bon nombre
  d'objets : **confirmé**.
- Filtre d'affichage réduit correctement le nombre de cartes visibles sans
  toucher aux occurrences enregistrées : **confirmé**.
- Distinction retrait de vue / archivage : **confirmé** dans l'interface et
  le code serveur (deux commandes distinctes).

## Ce qui n'est PAS encore fait (hors périmètre de cette boucle)

- **Capture voix/texte, transcription, propositions IA** (étape 3 du
  contrat) — la barre de capture est visible mais volontairement désactivée
  avec une infobulle ; aucune fonctionnalité n'est simulée.
- **Repères de réunion, résumés IA de changements** (V1.5).
- **Rôles/role_assignments avec UI dédiée** — le champ existe dans le
  schéma ; seule la description libre de Dominique (« Créateur · Propriétaire
  · Connecteur ») est affichée pour l'instant.
- **Disposition automatique ELK** (placement manuel + cadres manuels
  seulement pour l'instant).
- **Export/restauration administrateur**, sauvegardes planifiées.
- **Finances** (valorisations, détentions, revenus) — délibérément absentes,
  comme l'exige la spec pour la V1.
- **Tests automatisés** (unitaires/e2e) — la validation a été faite
  manuellement en navigateur pour cette boucle ; à ajouter avant l'étape 3.

## Configuration externe encore nécessaire avant un usage réel

1. **Un vrai projet Firebase** (Auth + Firestore) et ses variables dans
   `.env.local` / variables d'environnement Vercel — actuellement testé
   uniquement contre les émulateurs locaux. Sans ça, l'application ne peut
   pas fonctionner en dehors de cette machine.
2. **Déploiement Vercel** — explicitement reporté par consigne
   (« on va faire le Vercel plus tard »). Le projet est prêt pour ça
   (`npm run build` fonctionne) mais rien n'est publié.
3. **Règles Firestore/Storage** sont actuellement un verrou total (`if
   false`), ce qui est correct tant que tout passe par le serveur — à
   revalider si un accès client direct est ajouté plus tard (V1.5+).
4. Le mot de passe d'amorçage (`SEED_ADMIN_PASSWORD`) doit être changé après
   la première connexion réelle.

## Architecture des données

Voir `src/lib/types.ts` pour le schéma complet (adapté de la section 19 du
MASTER BUILD SPEC à Firestore) et `src/lib/server/` pour les commandes
métier (créer/modifier/archiver un objet, lier deux objets, ajouter/retirer
d'une vue, déplacer une occurrence, créer une tâche, adopter une décision) —
chacune vérifie les droits et la version attendue avant d'écrire, et
journalise l'événement métier correspondant.

---

## Public site — Studio by Dominique Soucy

Everything above documents the **private** internal tool (the login-gated
canvas at `/carte`, `/personnes`, etc.) — that code is untouched by what
follows. This section documents the **public** marketing site added on top
of it, under the `(public)` route group.

### What changed and why

This repository originally had no public-facing content at all: `/`
unconditionally redirected every visitor to `/login`. Per an explicit
rebuild request, `/` (and four new routes) now render a public site
explaining the Studio, its ecosystem of companies, its operating model and
its philosophy — while the private tool keeps its own routes, auth and
Firebase-backed data exactly as they were.

### Routes

| Route | Purpose |
|---|---|
| `/` | Homepage — the Living Signal hero + selected companies/projects |
| `/ecosystem` | The Gravity Interface — every project as an orbiting node |
| `/how-it-works` | The Decision Machine — the six-stage operating model |
| `/philosophy` | The Thought Field — authored principles and their connections |
| `/projects/[slug]` | One reusable presentation page per project |
| `/private` | Explains the Studio's access tiers; links to the existing `/login` |

### Source material

Four approved mockups and one animation kit
(`Studio_by_Dominique_Soucy_Animation_Kit.zip`, preserved at the repo root)
were supplied as visual direction. They were extracted into
`public/assets/studio/` (mockups, film-fragments, electric-signals,
editorial-marks, storyboard-fragments, signals) — see `ASSET_MANIFEST.md`
for exactly where each file is used. Nothing was shipped as a full-page
background image; every visible layer is live HTML/CSS/SVG, per the kit's
own production rules.

### Key docs

- `ASSET_MANIFEST.md` — where every supplied graphic element is used.
- `MOTION_SYSTEM.md` — the twelve motion primitives and the six signature
  interactions.
- `PROJECT_REGISTRY.md` — the project data schema, and the reasoning behind
  every status call that wasn't explicitly given.
- `DEPLOYMENT.md` — exactly what's still needed from Dominique before this
  goes live.
- `AUDIT_REPORT.md` — what was broken, what was changed, and what was
  tested.

### Validating locally

```bash
npm run lint
npm run build
npm run validate:registry   # project registry data checks
npm run start -- -p 3300 &
SMOKE_BASE_URL=http://localhost:3300 npm run smoke
```
