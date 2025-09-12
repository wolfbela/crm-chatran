import { sendEmail } from "./src/lib/email";

async function testEmailConfiguration() {
  console.log("🧪 Test de la configuration email Gmail...\n");

  // Vérification des variables d'environnement
  const requiredEnvVars = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM",
  ];

  console.log("📋 Vérification des variables d'environnement:");
  const missingVars: string[] = [];

  for (const varName of requiredEnvVars) {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: non définie`);
      missingVars.push(varName);
    } else {
      // Masquer les mots de passe dans les logs
      const displayValue = varName.includes("PASSWORD")
        ? "*".repeat(value.length)
        : value;
      console.log(`✅ ${varName}: ${displayValue}`);
    }
  }

  if (missingVars.length > 0) {
    console.error("\n❌ Variables d'environnement manquantes:");
    console.error("Veuillez définir:", missingVars.join(", "));
    console.error(
      "\nCopiez le fichier .env.example vers .env.local et remplissez les valeurs.",
    );
    process.exit(1);
  }

  // Test de l'envoi d'email
  const testEmail = process.env.SMTP_USER;
  if (!testEmail) {
    console.error("❌ SMTP_USER non défini pour le test");
    process.exit(1);
  }

  console.log("\n📧 Envoi d'un email de test...");

  try {
    await sendEmail({
      to: testEmail,
      subject: "Test - Configuration Gmail Shidoukh",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #007bff;">✅ Configuration Gmail réussie!</h1>
          <p>Félicitations! Votre configuration Gmail pour Shidoukh fonctionne correctement.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Détails de la configuration:</h3>
            <ul>
              <li><strong>Serveur SMTP:</strong> ${process.env.SMTP_HOST}</li>
              <li><strong>Port:</strong> ${process.env.SMTP_PORT}</li>
              <li><strong>Sécurité:</strong> ${process.env.SMTP_SECURE === "true" ? "TLS" : "STARTTLS"}</li>
              <li><strong>Utilisateur:</strong> ${process.env.SMTP_USER}</li>
            </ul>
          </div>
          <p>Vous pouvez maintenant utiliser les fonctionnalités d'email dans votre application:</p>
          <ul>
            <li>Confirmation d'inscription</li>
            <li>Réinitialisation de mot de passe</li>
            <li>Notifications</li>
          </ul>
          <hr style="margin: 30px 0;">
          <p style="color: #6c757d; font-size: 0.9em;">
            Cet email a été envoyé automatiquement par le script de test de Shidoukh.
          </p>
        </div>
      `,
    });

    console.log("✅ Email de test envoyé avec succès!");
    console.log(`📬 Vérifiez votre boîte mail: ${testEmail}`);
    console.log("\n🎉 Configuration Gmail validée!");
  } catch (error) {
    console.error("❌ Échec de l'envoi d'email:");
    console.error(error);
    console.log("\n🔧 Conseils de dépannage:");
    console.log(
      "1. Vérifiez que l'authentification à 2 facteurs est activée sur Gmail",
    );
    console.log(
      "2. Utilisez un mot de passe d'application (pas votre mot de passe Gmail)",
    );
    console.log(
      "3. Vérifiez que SMTP_USER contient votre adresse Gmail complète",
    );
    console.log(
      "4. Vérifiez que SMTP_PASSWORD contient le mot de passe d'application",
    );
    process.exit(1);
  }
}

// Exécution du test si le script est appelé directement
if (require.main === module) {
  testEmailConfiguration();
}

export { testEmailConfiguration };
