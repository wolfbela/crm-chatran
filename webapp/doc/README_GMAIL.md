# 📧 Configuration Gmail pour Shidoukh

Guide complet pour configurer l'envoi d'emails via Gmail dans l'application Shidoukh.

## 🚀 Configuration automatique (Recommandée)

La méthode la plus simple pour configurer Gmail :

```bash
cd webapp/
npm run setup:gmail
```

Ce script interactif vous guidera à travers :
- ✅ Validation de votre adresse Gmail
- ✅ Configuration automatique des variables d'environnement
- ✅ Test de l'envoi d'email
- ✅ Sauvegarde automatique des configurations existantes

## 🛠️ Configuration manuelle

### 1. Préparer votre compte Gmail

#### Activer l'authentification à deux facteurs
1. Allez sur [myaccount.google.com/security](https://myaccount.google.com/security)
2. Cliquez sur "Authentification en deux étapes"
3. Suivez les instructions pour l'activer

#### Générer un mot de passe d'application
1. Dans les paramètres de sécurité, cliquez sur "Mots de passe des applications"
2. Sélectionnez "Autre (nom personnalisé)" et tapez `Shidoukh`
3. **Copiez le mot de passe généré** (16 caractères sans espaces)

### 2. Créer le fichier de configuration

Créez `.env.local` dans le dossier `webapp/` :

```bash
# Configuration Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-application
SMTP_FROM=votre.email@gmail.com

# Configuration de l'application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=sqlite:./dev.db
SESSION_SECRET=votre-cle-secrete-unique
```

### 3. Générer une clé secrète sécurisée

```bash
npm run generate:secret
```

### 4. Tester la configuration

```bash
npm run test:email
```

## 📋 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run setup:gmail` | Configuration interactive complète |
| `npm run test:email` | Test de l'envoi d'email |
| `npm run generate:secret` | Génération de clés secrètes |

## 🔧 Dépannage

### Erreurs courantes

#### ❌ "Username and Password not accepted"
```bash
# Solutions :
# 1. Vérifiez l'authentification 2FA sur Gmail
# 2. Utilisez un mot de passe d'application (pas votre mot de passe Gmail)
# 3. Vérifiez l'adresse email complète

SMTP_USER=votre.email.complet@gmail.com  # ✅
SMTP_PASSWORD=abcdefghijklmnop             # ✅ 16 caractères
```

#### ❌ "Connection timeout"
```bash
# Solutions :
# 1. Vérifiez votre connexion internet
# 2. Vérifiez que le port 587 n'est pas bloqué
# 3. Testez avec un autre réseau si possible
```

#### ❌ "Missing environment variables"
```bash
# Vérifiez que .env.local existe et contient toutes les variables
ls -la .env.local
cat .env.local
```

### Diagnostic complet

```bash
# Test de la configuration
npm run test:email

# Vérification des variables d'environnement
echo $SMTP_USER
echo $SMTP_HOST

# Redémarrage si les variables ne sont pas chargées
npm run dev
```

## 🔒 Sécurité

### ✅ Bonnes pratiques
- **Utilisez un mot de passe d'application unique** pour chaque service
- **Activez l'authentification 2FA** sur votre compte Gmail
- **Ne commitez jamais** le fichier `.env.local` (déjà dans .gitignore)
- **Utilisez des clés secrètes différentes** pour chaque environnement

### ❌ À éviter absolument
- ❌ Utiliser votre mot de passe Gmail principal
- ❌ Partager vos variables d'environnement
- ❌ Commiter des fichiers de configuration avec des secrets
- ❌ Utiliser la même clé secrète en développement et en production

## 🚢 Déploiement

### Variables d'environnement en production

Pour déployer en production, définissez les variables sur votre plateforme :

#### Vercel
```bash
vercel env add SMTP_USER
vercel env add SMTP_PASSWORD
vercel env add SMTP_FROM
vercel env add SESSION_SECRET
```

#### Heroku
```bash
heroku config:set SMTP_USER=votre.email@gmail.com
heroku config:set SMTP_PASSWORD=votre-mot-de-passe-app
heroku config:set SMTP_FROM=votre.email@gmail.com
heroku config:set SESSION_SECRET=votre-cle-secrete
```

#### Docker
Utilisez le fichier `.env` avec docker-compose :
```bash
cp .env.docker.example .env
# Éditez .env avec vos vraies valeurs
docker-compose up
```

## 📧 Fonctionnalités Email

Une fois configuré, l'application envoie automatiquement des emails pour :

### 🆕 Inscription
- Email de confirmation avec lien d'activation
- Template HTML responsive
- Lien sécurisé avec token temporaire

### 🔑 Mot de passe oublié
- Lien de réinitialisation sécurisé
- Token avec expiration (24h par défaut)
- Instructions claires pour l'utilisateur

### 📬 Notifications
- Personnalisables selon les préférences utilisateur
- Templates HTML professionnels
- Support multi-langue (français par défaut)

## 🎨 Personnalisation

### Modifier les templates d'email
Les templates sont dans `src/lib/auth-actions.ts` :

```typescript
// Template de confirmation
async function sendConfirmationEmail(email: string, token: string) {
  // Personnalisez le HTML ici
}

// Template de réinitialisation
async function sendPasswordResetEmail(email: string, token: string) {
  // Personnalisez le HTML ici
}
```

### Modifier l'expéditeur
Dans `src/lib/constants.ts` :

```typescript
export const EMAIL_CONFIG = {
  FROM_NAME: "Votre App Name", // Changez ici
  SUBJECT: {
    EMAIL_CONFIRMATION: "Votre sujet personnalisé",
    PASSWORD_RESET: "Votre sujet de reset",
  },
};
```

## 📚 Documentation complète

- [`EMAIL_CONFIG.md`](./EMAIL_CONFIG.md) - Configuration détaillée
- [`GMAIL_SETUP.md`](./GMAIL_SETUP.md) - Guide de démarrage rapide
- [Documentation officielle Gmail SMTP](https://support.google.com/mail/answer/7126229)

## 🆘 Support

### Problème persistant ?

1. **Exécutez le diagnostic** : `npm run test:email`
2. **Vérifiez les logs** dans la console de votre navigateur
3. **Consultez les guides** : [GMAIL_SETUP.md](./GMAIL_SETUP.md)
4. **Testez avec un autre compte** Gmail si possible

### Logs utiles

```bash
# Logs de l'application Next.js
npm run dev

# Logs Docker (si vous utilisez Docker)
docker-compose logs webapp

# Variables d'environnement chargées
npm run test:email
```

---

*Configuration testée avec Gmail, Next.js 15, Node.js 18+ et TypeScript 5+*