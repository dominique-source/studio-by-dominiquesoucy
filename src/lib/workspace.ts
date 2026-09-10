// V1 : un seul espace de travail. Le champ workspaceId est conservé partout
// dans le schéma pour ne pas coupler le modèle à cette hypothèse (spec §19).
export const WORKSPACE_ID = process.env.STUDIO_WORKSPACE_ID ?? "studio-dominique-soucy";
