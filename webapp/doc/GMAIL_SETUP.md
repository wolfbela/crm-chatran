# 🚀 Configuration Gmail - Guide de démarrage rapide

Ce guide vous permet de configurer Gmail en 5 minutes pour l'envoi d'emails dans Shidoukh.

## ⚡ Étapes rapides

### 1. Préparer votre compte Gmail

```bash
# Ouvrez votre navigateur et allez sur :
https://myaccount.google.com/security
```

1. **Activez l'authentification à 2 facteurs** si ce n'est pas déjà fait
2. Dans la section "Authentification en deux étapes", cliquez sur **"Mots de passe des applications"**
3. Sélectionnez **"Autre (nom personnalisé)"** et tapez `Shidoukh`
4. **Copiez le mot de passe généré** (16 caractères)

### 2. Configurer l'environnement

Créez le fichier `.env.local` dans le dossier `webapp/` :

```bash
# Configuration Gmail pour Shidoukh
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM=votre.email@gmail.com

# Configuration de base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=sqlite:./dev.db
SESSION_SECRET=changez-cette-cle-en-production
```

**Remplacez :**
- `votre.email@gmail.com` → votre vraie adresse Gmail
- `abcd efgh ijkl mnop` → le mot de passe d'application (sans espaces)

### 3. Tester la configuration

```bash
cd webapp/
npm run test:email
```

Si tout fonctionne, vous verrez :
```
✅ Email de test envoyé avec succès!
📬 Vérifiez votre boîte mail: votre.email@gmail.com
🎉 Configuration Gmail validée!
```

## 🔧 Dépannage rapide

### ❌ "Username and Password not accepted"
```bash
# Vérifiez :
SMTP_USER=votre.email.complet@gmail.com  # ✅ Adresse complète
SMTP_PASSWORD=motdepasseapplication       # ✅ Mot de passe d'app (pas Gmail)
```

### ❌ "Missing environment variables"
```bash
# Vérifiez que .env.local existe et contient :
ls -la webapp/.env.local
cat webapp/.env.local
```

### ❌ Variables non chargées
```bash
# Redémarrez votre serveur Next.js
npm run dev
```

## ✅ Utilisation dans l'application

Une fois configuré, les emails sont automatiquement envoyés pour :

- **Inscription** → Email de confirmation
- **Mot de passe oublié** → Lien de réinitialisation
- **Notifications** → Selon vos paramètres

## 🔒 Sécurité

### ✅ À faire
- Utilisez un mot de passe d'application unique
- Gardez `.env.local` privé (déjà dans .gitignore)
- Activez l'authentification 2FA sur Gmail

### ❌ À éviter
- Ne jamais utiliser votre mot de passe Gmail principal
- Ne jamais commiter le fichier `.env.local`
- Ne pas partager vos variables d'environnement

## 📞 Support

Problème persistant ? 
1. Exécutez `npm run test:email` pour diagnostiquer
2. Vérifiez les logs dans la console
3. Consultez [EMAIL_CONFIG.md](./EMAIL_CONFIG.md) pour plus de détails

---

*Configuration testée avec Gmail, Next.js 15, et Node.js 18+*