import { writeFileSync, existsSync, readFileSync } from "fs";
import { randomBytes } from "crypto";
import { sendEmail } from "./src/lib/email";

interface GmailConfig {
  email: string;
  appPassword: string;
  sessionSecret?: string;
}

function generateSessionSecret(): string {
  return randomBytes(32).toString("hex");
}

function createEnvContent(config: GmailConfig): string {
  const sessionSecret = config.sessionSecret || generateSessionSecret();

  return `# Configuration Gmail pour Shidoukh - Généré automatiquement
# ${new Date().toLocaleString()}

# Configuration SMTP Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=${config.email}
SMTP_PASSWORD=${config.appPassword}
SMTP_FROM=${config.email}

# Configuration de l'application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=sqlite:./dev.db
SESSION_SECRET=${sessionSecret}

# Instructions de sécurité:
# - Ne jamais commiter ce fichier
# - Utilisez un mot de passe d'application Gmail (pas votre mot de passe habituel)
# - Gardez ces informations confidentielles
`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@gmail\.com$/;
  return emailRegex.test(email);
}

function validateAppPassword(password: string): boolean {
  // Mot de passe d'application Gmail : 16 caractères sans espaces
  return password.length === 16 && !/\s/.test(password);
}

async function testGmailConnection(config: GmailConfig): Promise<boolean> {
  // Sauvegarder temporairement les variables d'environnement
  const originalEnv = { ...process.env };

  try {
    // Définir les variables d'environnement pour le test
    process.env.SMTP_HOST = "smtp.gmail.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_SECURE = "false";
    process.env.SMTP_USER = config.email;
    process.env.SMTP_PASSWORD = config.appPassword;
    process.env.SMTP_FROM = config.email;

    await sendEmail({
      to: config.email,
      subject: "🎉 Configuration Gmail réussie - Shidoukh",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #28a745;">✅ Gmail configuré avec succès!</h1>
          <p>Votre configuration Gmail pour Shidoukh est maintenant opérationnelle.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Configuration utilisée:</h3>
            <ul>
              <li><strong>Email:</strong> ${config.email}</li>
              <li><strong>Serveur:</strong> smtp.gmail.com:587</li>
              <li><strong>Sécurité:</strong> STARTTLS</li>
            </ul>
          </div>
          <p>Vous pouvez maintenant utiliser toutes les fonctionnalités d'email :</p>
          <ul>
            <li>Confirmation d'inscription</li>
            <li>Réinitialisation de mot de passe</li>
            <li>Notifications</li>
          </ul>
          <hr style="margin: 30px 0;">
          <p style="color: #6c757d; font-size: 0.9em;">
            Email envoyé automatiquement par le script de configuration Shidoukh.
          </p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Erreur de test de connexion:", error);
    return false;
  } finally {
    // Restaurer les variables d'environnement originales
    process.env = originalEnv;
  }
}

function backupExistingEnv(): void {
  const envPath = ".env.local";
  const backupPath = `.env.local.backup.${Date.now()}`;

  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf8");
    writeFileSync(backupPath, content);
    console.log(`📋 Sauvegarde créée: ${backupPath}`);
  }
}

function showInstructions(): void {
  console.log(`
🚀 Configuration Gmail pour Shidoukh

Ce script va configurer automatiquement Gmail pour l'envoi d'emails.

📋 Avant de commencer, assurez-vous d'avoir :
   1. Un compte Gmail avec l'authentification 2FA activée
   2. Un mot de passe d'application Gmail généré

🔗 Pour générer un mot de passe d'application :
   1. Allez sur https://myaccount.google.com/security
   2. Authentification en deux étapes → Mots de passe des applications
   3. Sélectionnez "Autre (nom personnalisé)" et tapez "Shidoukh"
   4. Copiez le mot de passe généré (16 caractères)

⚠️  Important : Utilisez le mot de passe d'application, PAS votre mot de passe Gmail habituel.

`);
}

async function promptUser(question: string): Promise<string> {
  process.stdout.write(question);

  return new Promise((resolve) => {
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

async function setupGmail(): Promise<void> {
  showInstructions();

  // Configuration interactive
  const email = await promptUser("📧 Entrez votre adresse Gmail : ");

  if (!validateEmail(email)) {
    console.error(
      "❌ Adresse email Gmail invalide. Format requis : exemple@gmail.com",
    );
    process.exit(1);
  }

  const appPassword = await promptUser(
    "🔑 Entrez votre mot de passe d'application Gmail : ",
  );

  if (!validateAppPassword(appPassword)) {
    console.error(
      "❌ Mot de passe d'application invalide. Il doit contenir exactement 16 caractères sans espaces.",
    );
    process.exit(1);
  }

  const config: GmailConfig = { email, appPassword };

  console.log("\n🔧 Configuration en cours...");

  // Sauvegarder l'ancien fichier si il existe
  backupExistingEnv();

  // Créer le fichier .env.local
  const envContent = createEnvContent(config);
  writeFileSync(".env.local", envContent);
  console.log("✅ Fichier .env.local créé");

  // Tester la connexion
  console.log("\n📧 Test de la configuration Gmail...");
  const isWorking = await testGmailConnection(config);

  if (isWorking) {
    console.log("✅ Test réussi! Email de confirmation envoyé.");
    console.log(`📬 Vérifiez votre boîte mail : ${email}`);
    console.log("\n🎉 Configuration Gmail terminée avec succès!");
    console.log("\n📋 Prochaines étapes :");
    console.log("   1. Démarrez votre application : npm run dev");
    console.log(
      "   2. Testez l'inscription sur http://localhost:3000/auth/register",
    );
    console.log("   3. Vérifiez la réception des emails de confirmation");
  } else {
    console.error("❌ Échec du test de configuration");
    console.error("\n🔧 Vérifications à faire :");
    console.error("   1. L'authentification 2FA est-elle activée sur Gmail ?");
    console.error("   2. Le mot de passe d'application est-il correct ?");
    console.error("   3. Votre connexion internet fonctionne-t-elle ?");
    console.error("   4. Le port 587 est-il ouvert ?");
    process.exit(1);
  }
}

async function main(): Promise<void> {
  try {
    process.stdin.setRawMode?.(false);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    await setupGmail();

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la configuration :", error);
    process.exit(1);
  }
}

// Exécution si le script est appelé directement
if (require.main === module) {
  main();
}

export { setupGmail, validateEmail, validateAppPassword };
