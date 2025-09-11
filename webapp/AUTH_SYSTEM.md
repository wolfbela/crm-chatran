# Système d'Authentification

Ce système d'authentification complet comprend l'inscription, la connexion, la confirmation d'email, et la réinitialisation de mot de passe.

## Fonctionnalités

### ✅ Inscription (Register)
- Validation des mots de passe (minimum 8 caractères)
- Vérification que les mots de passe correspondent
- Vérification de l'unicité de l'email
- Envoi automatique d'un email de confirmation
- Connexion automatique après inscription (avec compte non confirmé)

### ✅ Connexion (Login)
- Validation des identifiants
- Vérification que le compte est confirmé
- Session sécurisée avec cookies httpOnly

### ✅ Confirmation d'email
- Token unique généré à l'inscription
- Email automatique avec lien de confirmation
- Page de confirmation avec feedback utilisateur

### ✅ Mot de passe oublié
- Génération d'un token de réinitialisation
- Email avec lien sécurisé (expire en 24h)
- Page de saisie du nouveau mot de passe

### ✅ Protection des routes
- Middleware qui redirige les utilisateurs non connectés
- Redirection automatique des utilisateurs connectés depuis les pages d'auth

## Structure des fichiers

```
src/
├── lib/
│   ├── auth-actions.ts        # Actions serveur d'authentification
│   ├── email.ts              # Service d'envoi d'emails
│   └── constants.ts          # Constantes et messages
├── components/auth/
│   ├── login-form.tsx        # Formulaire de connexion
│   ├── register-form.tsx     # Formulaire d'inscription
│   ├── forgot-password-form.tsx
│   ├── reset-password-form.tsx
│   └── email-confirmation-form.tsx
├── app/auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── confirm-email/page.tsx
└── middleware.ts             # Protection des routes
```

## Routes disponibles

- `/auth/login` - Page de connexion
- `/auth/register` - Page d'inscription
- `/auth/forgot-password` - Demande de réinitialisation
- `/auth/reset-password?token=...` - Réinitialisation avec token
- `/auth/confirm-email?token=...` - Confirmation d'email

## Base de données

### Table `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  confirmed BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR,
  reset_token_expires TIMESTAMP,
  confirmation_token VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Configuration

### Variables d'environnement
Voir `EMAIL_CONFIG.md` pour la configuration complète des emails.

Variables requises :
- `SMTP_HOST` - Serveur SMTP
- `SMTP_PORT` - Port SMTP (587 recommandé)
- `SMTP_USER` - Utilisateur SMTP
- `SMTP_PASSWORD` - Mot de passe SMTP
- `NEXT_PUBLIC_BASE_URL` - URL de base de l'app

### Sécurité
- Mots de passe hachés avec bcrypt (12 rounds)
- Tokens UUID v4 pour reset/confirmation
- Sessions sécurisées avec cookies httpOnly
- Expiration des tokens de réinitialisation (24h)

## Utilisation

### 1. Inscription
```typescript
import { registerUser } from '@/lib/auth-actions';

const result = await registerUser(formData);
if (result.success) {
  // Utilisateur créé et connecté
  // Email de confirmation envoyé
}
```

### 2. Connexion
```typescript
import { loginUser } from '@/lib/auth-actions';

const result = await loginUser(formData);
if (result.success) {
  // Utilisateur connecté
}
```

### 3. Récupérer l'utilisateur actuel
```typescript
import { getCurrentUser } from '@/lib/auth-actions';

const user = await getCurrentUser();
if (user) {
  console.log(user.email, user.confirmed);
}
```

### 4. Déconnexion
```typescript
import { logoutUser } from '@/lib/auth-actions';

await logoutUser(); // Redirige vers /auth/login
```

## Intégration avec l'UI

### Toasts (Notifications)
Le système utilise Sonner pour les notifications :
- Messages de succès (inscription, connexion, etc.)
- Messages d'erreur (identifiants invalides, etc.)
- Feedback en temps réel

### Formulaires
- Validation côté client et serveur
- États de chargement
- Gestion des erreurs
- Design responsive avec Tailwind

### Protection des routes
Le middleware protège automatiquement toutes les routes sauf :
- Les pages d'authentification (`/auth/*`)
- Les assets statiques
- Les routes API

## Messages d'erreur

Tous les messages sont centralisés dans `constants.ts` :
- `INVALID_CREDENTIALS` - Identifiants invalides
- `EMAIL_ALREADY_EXISTS` - Email déjà utilisé
- `PASSWORDS_DONT_MATCH` - Mots de passe différents
- `ACCOUNT_NOT_CONFIRMED` - Compte non confirmé
- `WEAK_PASSWORD` - Mot de passe trop faible

## Développement

### Tests
Pour tester le système :
1. Configurez les variables SMTP
2. Créez un compte via `/auth/register`
3. Vérifiez l'email de confirmation
4. Testez la connexion/déconnexion
5. Testez la réinitialisation de mot de passe

### Personnalisation
- Modifiez les constantes dans `constants.ts`
- Personnalisez les templates d'emails dans `auth-actions.ts`
- Adaptez le design des formulaires
- Ajustez les durées de session/tokens

## Sécurité et Bonnes Pratiques

✅ Mots de passe hachés avec bcrypt  
✅ Tokens sécurisés avec UUID  
✅ Sessions httpOnly  
✅ Protection CSRF avec SameSite  
✅ Validation côté serveur  
✅ Expiration des tokens  
✅ Messages d'erreur sécurisés  
✅ Pas de leak d'informations sensibles  

## Migration

Pour activer le système d'authentification :
```bash
npm run db:migrate:up
```

Ceci créera la table `users` avec la nouvelle structure d'authentification.