export const RELIGIOUS_LEVELS = {
  HILONI: 1,
  TRADITIONALIST: 2,
  PRATIQUANT: 3,
  TRES_PRATIQUANT: 4,
  HAREDI: 5,
} as const;

export const RELIGIOUS_LEVEL_LABELS = {
  [RELIGIOUS_LEVELS.HILONI]: "Hiloni",
  [RELIGIOUS_LEVELS.TRADITIONALIST]: "Traditionaliste",
  [RELIGIOUS_LEVELS.PRATIQUANT]: "Pratiquant",
  [RELIGIOUS_LEVELS.TRES_PRATIQUANT]: "Très pratiquant",
  [RELIGIOUS_LEVELS.HAREDI]: "Haredi",
} as const;

export type ReligiousLevel =
  (typeof RELIGIOUS_LEVELS)[keyof typeof RELIGIOUS_LEVELS];

export const NAVIGATION_ROUTES = {
  HOME: "/",
  PERSONNES: "/personnes",
  MEETINGS: "/meetings",
} as const;

export const NAVIGATION_LABELS = {
  [NAVIGATION_ROUTES.HOME]: "Tableau de bord",
  [NAVIGATION_ROUTES.PERSONNES]: "Personnes",
  [NAVIGATION_ROUTES.MEETINGS]: "Meetings",
} as const;

export const MESSAGES = {
  SUCCESS: {
    PERSON_CREATED: "Personne créée avec succès",
    PERSON_UPDATED: "Personne mise à jour avec succès",
    PERSON_DELETED: "Personne supprimée avec succès",
    MEETING_CREATED: "Meeting créé avec succès",
    MEETING_UPDATED: "Meeting mis à jour avec succès",
    MEETING_DELETED: "Meeting supprimé avec succès",
  },
  ERROR: {
    REQUIRED_FIELDS: "Tous les champs requis doivent être remplis",
    DIFFERENT_PERSONS: "Les deux personnes doivent être différentes",
    PERSON_CREATE_ERROR: "Erreur lors de la création de la personne",
    PERSON_UPDATE_ERROR: "Erreur lors de la mise à jour de la personne",
    PERSON_DELETE_ERROR: "Erreur lors de la suppression de la personne",
    MEETING_CREATE_ERROR: "Erreur lors de la création du meeting",
    MEETING_UPDATE_ERROR: "Erreur lors de la mise à jour du meeting",
    MEETING_DELETE_ERROR: "Erreur lors de la suppression du meeting",
  },
  EMPTY_STATE: {
    NO_PERSONS: "Aucune personne trouvée",
    NO_MEETINGS: "Aucun meeting trouvé",
  },
} as const;

export const UI_CONFIG = {
  CAROUSEL: {
    ITEMS_PER_VIEW: 3,
  },
  TABLE: {
    ITEMS_PER_PAGE: 10,
  },
} as const;
