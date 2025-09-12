# Configuration des emails - Gmail

Cette documentation explique comment configurer Gmail pour l'envoi d'emails dans l'application Shidoukh.

## Configuration rapide pour Gmail

### 1. Prérequis Gmail

1. **Activez l'authentification à deux facteurs** sur votre compte Gmail :
   - Allez sur [myaccount.google.com](https://myaccount.google.com)
   - Sécurité → Authentification en deux étapes
   - Suivez les instructions pour l'activer

2. **Générez un mot de passe d'application** :
   - Dans les paramètres de sécurité Google
   - Sélectionnez "Mots de passe des applications"
   - Choisissez "Autre (nom personnalisé)" et tapez "Shidoukh"
   - Copiez le mot de passe généré (16 caractères sans espaces)

### 2. Configuration des variables d'environnement

Créez un fichier `.env.local` dans le dossier `webapp/` :

```bash
# Configuration SMTP pour Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-application
SMTP_FROM=votre-email@gmail.com

# URL de base de l'application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Configuration de base de données
DATABASE_URL=sqlite:./dev.db

# Clé secrète pour les sessions
SESSION_SECRET=votre-cle-secrete-unique
```

**⚠️ Important :**
- Remplacez `votre-email@gmail.com` par votre vraie adresse Gmail
- Remplacez `votre-mot-de-passe-application` par le mot de passe généré à l'étape 1
- Ne jamais utiliser votre mot de passe Gmail habituel

### 3. Test de la configuration

Testez votre configuration avec la commande :

```bash
npm run test:email
```

Cette commande :
- Vérifie que toutes les variables d'environnement sont définies
- Envoie un email de test à votre adresse
- Affiche le statut de la configuration

## Configuration pour d'autres environnements

### Développement local
Utilisez le fichier `.env.local` comme décrit ci-dessus.

### Production
Définissez les variables d'environnement directement sur votre plateforme de déploiement :
- Vercel : Settings → Environment Variables
- Heroku : Config Vars
- Docker : Variables d'environnement dans docker-compose.yml

## Sécurité

### Bonnes pratiques
- ✅ Utilisez toujours un mot de passe d'application, jamais votre mot de passe principal
- ✅ Activez l'authentification à deux facteurs sur Gmail
- ✅ Ne commitez jamais le fichier `.env.local` (il est dans .gitignore)
- ✅ Utilisez des variables d'environnement différentes pour chaque environnement

### Variables sensibles
Les variables suivantes ne doivent JAMAIS être exposées publiquement :
- `SMTP_PASSWORD` : Le mot de passe d'application Gmail
- `SESSION_SECRET` : La clé de chiffrement des sessions

## Dépannage

### Erreur : "Username and Password not accepted"
- Vérifiez que l'authentification à 2 facteurs est activée
- Utilisez un mot de passe d'application, pas votre mot de passe Gmail
- Vérifiez que l'adresse email est correcte

### Erreur : "Connection timeout"
- Vérifiez votre connexion internet
- Vérifiez que le port 587 n'est pas bloqué par votre firewall

### Erreur : "Authentication failed"
- Le mot de passe d'application est peut-être expiré, générez-en un nouveau
- Vérifiez que `SMTP_USER` contient votre adresse Gmail complète

### Les emails n'arrivent pas
- Vérifiez vos spams/courriers indésirables
- Vérifiez les logs de la console pour les erreurs
- Utilisez `npm run test:email` pour diagnostiquer

## Emails envoyés par l'application

L'application envoie automatiquement des emails pour :

1. **Confirmation d'inscription** : Envoyé lors de la création d'un compte
2. **Réinitialisation de mot de passe** : Envoyé via "Mot de passe oublié"
3. **Notifications** : Selon la configuration de l'utilisateur

## Configuration avancée

### Modification du nom d'expéditeur
Modifiez `EMAIL_CONFIG.FROM_NAME` dans `src/lib/constants.ts` :

```typescript
export const EMAIL_CONFIG = {
  FROM_NAME: "Votre App Name",
  // ...
};
```

### Templates d'emails personnalisés
Les templates sont définis dans `src/lib/auth-actions.ts` dans les fonctions :
- `sendConfirmationEmail()` : Template de confirmation
- `sendPasswordResetEmail()` : Template de réinitialisation

### Autres fournisseurs SMTP

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Serveur SMTP personnalisé
```bash
SMTP_HOST=votre-serveur.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=utilisateur
SMTP_PASSWORD=mot-de-passe
```

## Support

Si vous rencontrez des problèmes :
1. Exécutez `npm run test:email` pour diagnostiquer
2. Vérifiez les logs de la console
3. Consultez la section dépannage ci-dessus
4. Vérifiez que votre configuration Gmail est correcte