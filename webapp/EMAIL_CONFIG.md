# Configuration des emails

Pour que le système d'authentification fonctionne correctement, vous devez configurer les variables d'environnement pour l'envoi d'emails.

## Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env.local` :

```bash
# Configuration SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app
SMTP_FROM=votre-email@gmail.com

# URL de base de l'application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Configuration Gmail

1. Activez l'authentification à deux facteurs sur votre compte Gmail
2. Générez un mot de passe d'application :
   - Allez dans les paramètres de votre compte Google
   - Sécurité > Authentification à 2 facteurs > Mots de passe des applications
   - Générez un nouveau mot de passe d'application
   - Utilisez ce mot de passe dans `SMTP_PASSWORD`

## Configuration pour d'autres fournisseurs

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Serveur SMTP personnalisé
Adaptez les valeurs selon votre fournisseur :
```bash
SMTP_HOST=votre-serveur-smtp.com
SMTP_PORT=587
SMTP_SECURE=true  # pour le port 465
SMTP_USER=votre-utilisateur
SMTP_PASSWORD=votre-mot-de-passe
```

## Test de la configuration

Pour tester si les emails fonctionnent :
1. Créez un nouveau compte via `/auth/register`
2. Vérifiez que l'email de confirmation arrive
3. Testez la réinitialisation de mot de passe via `/auth/forgot-password`

## Dépannage

Si les emails ne sont pas envoyés :
1. Vérifiez les logs de la console pour les erreurs
2. Assurez-vous que les variables d'environnement sont correctement définies
3. Vérifiez que votre fournisseur SMTP autorise l'authentification par mot de passe d'application
4. Vérifiez les paramètres de sécurité de votre compte email