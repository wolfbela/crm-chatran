import { randomBytes } from "crypto";

interface SecretOptions {
  length?: number;
  format?: "hex" | "base64";
}

function generateSecret({ length = 32, format = "hex" }: SecretOptions = {}): string {
  const secret = randomBytes(length);
  return format === "base64" ? secret.toString("base64") : secret.toString("hex");
}

function generateMultipleSecrets() {
  console.log("🔐 Génération de clés secrètes sécurisées\n");

  console.log("SESSION_SECRET (recommandé) :");
  console.log(generateSecret({ length: 32, format: "hex" }));

  console.log("\nSESSION_SECRET (alternative base64) :");
  console.log(generateSecret({ length: 32, format: "base64" }));

  console.log("\nClé courte (16 bytes) :");
  console.log(generateSecret({ length: 16, format: "hex" }));

  console.log("\nClé longue (64 bytes) :");
  console.log(generateSecret({ length: 64, format: "hex" }));

  console.log("\n📋 Copiez une des clés ci-dessus dans votre fichier .env.local :");
  console.log("SESSION_SECRET=votre-clé-générée-ici");

  console.log("\n⚠️  Important : Gardez ces clés privées et utilisez des clés différentes pour chaque environnement.");
}

// Exécution du script si appelé directement
if (require.main === module) {
  generateMultipleSecrets();
}

export { generateSecret, generateMultipleSecrets };
