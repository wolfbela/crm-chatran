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
  WHATSAPP: "/communication/whatsapp",
  MAIL: "/communication/mail",
  INSTAGRAM: "/communication/instagram",
  TWITTER: "/communication/twitter",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CONFIRM_EMAIL: "/auth/confirm-email",
} as const;

export const NAVIGATION_LABELS = {
  [NAVIGATION_ROUTES.HOME]: "Tableau de bord",
  [NAVIGATION_ROUTES.PERSONNES]: "Personnes",
  [NAVIGATION_ROUTES.MEETINGS]: "Meetings",
  [NAVIGATION_ROUTES.WHATSAPP]: "WhatsApp",
  [NAVIGATION_ROUTES.MAIL]: "Mail",
  [NAVIGATION_ROUTES.INSTAGRAM]: "Instagram",
  [NAVIGATION_ROUTES.TWITTER]: "Twitter",
  [NAVIGATION_ROUTES.LOGIN]: "Connexion",
  [NAVIGATION_ROUTES.REGISTER]: "Inscription",
  [NAVIGATION_ROUTES.FORGOT_PASSWORD]: "Mot de passe oublié",
  [NAVIGATION_ROUTES.RESET_PASSWORD]: "Réinitialiser le mot de passe",
  [NAVIGATION_ROUTES.CONFIRM_EMAIL]: "Confirmer l'email",
} as const;

export const COMMUNICATION_ROUTES = {
  WHATSAPP: NAVIGATION_ROUTES.WHATSAPP,
  MAIL: NAVIGATION_ROUTES.MAIL,
  INSTAGRAM: NAVIGATION_ROUTES.INSTAGRAM,
  TWITTER: NAVIGATION_ROUTES.TWITTER,
} as const;

export const COMMUNICATION_LABELS = {
  [COMMUNICATION_ROUTES.WHATSAPP]:
    NAVIGATION_LABELS[NAVIGATION_ROUTES.WHATSAPP],
  [COMMUNICATION_ROUTES.MAIL]: NAVIGATION_LABELS[NAVIGATION_ROUTES.MAIL],
  [COMMUNICATION_ROUTES.INSTAGRAM]:
    NAVIGATION_LABELS[NAVIGATION_ROUTES.INSTAGRAM],
  [COMMUNICATION_ROUTES.TWITTER]: NAVIGATION_LABELS[NAVIGATION_ROUTES.TWITTER],
} as const;

export const MESSAGES = {
  SUCCESS: {
    PERSON_CREATED: "Personne créée avec succès",
    PERSON_UPDATED: "Personne mise à jour avec succès",
    PERSON_DELETED: "Personne supprimée avec succès",
    MEETING_CREATED: "Meeting créé avec succès",
    MEETING_UPDATED: "Meeting mis à jour avec succès",
    MEETING_DELETED: "Meeting supprimé avec succès",
    ACCOUNT_CREATED: "Compte créé avec succès",
    LOGIN_SUCCESS: "Connexion réussie",
    PASSWORD_RESET_EMAIL_SENT: "Email de réinitialisation envoyé",
    PASSWORD_RESET_SUCCESS: "Mot de passe réinitialisé avec succès",
    EMAIL_CONFIRMED: "Email confirmé avec succès",
    CONFIRMATION_EMAIL_SENT: "Email de confirmation envoyé",
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
    INVALID_CREDENTIALS: "Identifiants invalides",
    EMAIL_ALREADY_EXISTS: "Cet email est déjà utilisé",
    PASSWORDS_DONT_MATCH: "Les mots de passe ne correspondent pas",
    INVALID_EMAIL: "Format d'email invalide",
    WEAK_PASSWORD: "Le mot de passe doit contenir au moins 8 caractères",
    ACCOUNT_NOT_CONFIRMED:
      "Veuillez confirmer votre email avant de vous connecter",
    INVALID_TOKEN: "Token invalide ou expiré",
    EMAIL_SEND_ERROR: "Erreur lors de l'envoi de l'email",
    USER_NOT_FOUND: "Utilisateur introuvable",
    GENERIC_ERROR: "Une erreur est survenue",
  },
  EMPTY_STATE: {
    NO_PERSONS: "Aucune personne trouvée",
    NO_MEETINGS: "Aucun meeting trouvé",
  },
} as const;

export const AUTH_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  TOKEN_EXPIRY_HOURS: 24,
  SESSION_DURATION_DAYS: 30,
} as const;

export const EMAIL_CONFIG = {
  FROM_NAME: "Shidoukh App",
  SUBJECT: {
    EMAIL_CONFIRMATION: "Confirmez votre email - Shidoukh",
    PASSWORD_RESET: "Réinitialisation de mot de passe - Shidoukh",
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
