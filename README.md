# WebApp - Modern Full-Stack Application

Une application web moderne construite avec Next.js 15, TypeScript, PostgreSQL et Docker.

## 🚀 Technologies

- **Frontend**: Next.js 15 avec App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui avec Radix UI
- **Base de données**: PostgreSQL avec Kysely query builder
- **Containerisation**: Docker & Docker Compose
- **Reverse Proxy**: Traefik avec Let's Encrypt
- **CI/CD**: GitHub Actions
- **Development**: Vagrant pour environnement de dev

## 📁 Structure du projet

```
test-ai/
├── webapp/                 # Application Next.js
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Components React
│   │   └── lib/           # Utilitaires et config DB
│   ├── package.json
│   └── next.config.js
├── docker/                # Configuration Docker
│   ├── Dockerfile
│   ├── init.sql
│   └── acme.json
├── .github/workflows/     # GitHub Actions
├── docker-compose.yml
├── Vagrantfile
└── README.md
```

## 🛠️ Installation et développement

### Avec Vagrant (recommandé)

```bash
# Démarrer l'environnement de développement
vagrant up

# Se connecter à la VM
vagrant ssh

# Naviguer vers le projet
cd /opt/webapp

# Démarrer les services
docker-compose up -d
```

### Installation manuelle

```bash
# Cloner le projet
git clone <repository-url>
cd test-ai

# Installer les dépendances
cd webapp
npm install

# Configurer l'environnement
cp .env.example .env

# Démarrer PostgreSQL
docker-compose up -d postgres

# Développement local
npm run dev
```

## 🐳 Déploiement avec Docker

### Développement

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f webapp

# Arrêter les services
docker-compose down
```

### Production

```bash
# Build et démarrage
docker-compose -f docker-compose.yml up -d

# Vérification du statut
docker-compose ps
```

## 🔧 Configuration

### Base de données

- **Host**: postgres (dans Docker) ou localhost
- **Port**: 5432
- **Database**: webapp
- **User**: lama
- **Password**: JaimeLesChevaux

### Environnements

- **Development**: http://localhost:3000
- **Production**: https://www.example.com

### Traefik Dashboard

Accessible sur http://localhost:8080 (développement)

## 🚢 CI/CD

La pipeline GitHub Actions se déclenche automatiquement sur push vers `main`:

1. **Tests** - Linting et build
2. **Build** - Construction de l'image Docker
3. **Deploy** - Déploiement sur le serveur de production
4. **Health Check** - Vérification du déploiement

### Variables d'environnement requises

```bash
# GitHub Secrets
DOCKER_REGISTRY=your-registry.com
DOCKER_USERNAME=username
DOCKER_PASSWORD=password
HOST=your-server.com
USERNAME=deploy-user
SSH_KEY=private-ssh-key
PORT=22
```

## 📊 Base de données

### Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Kysely Usage

```typescript
import { db } from '@/lib/database'

// Sélection
const users = await db.selectFrom('users').selectAll().execute()

// Insertion
await db.insertInto('users')
  .values({ email: 'user@example.com', name: 'John Doe' })
  .execute()
```

## 🔒 Sécurité

- Variables d'environnement pour les secrets
- Utilisateur non-root dans Docker
- TLS automatique avec Let's Encrypt
- Validation des données avec TypeScript

## 📝 Scripts disponibles

```bash
# Dans webapp/
npm run dev          # Développement
npm run build        # Build production
npm run start        # Démarrer en production
npm run lint         # Linter
npm run db:generate  # Génération types Kysely
```

## 🌐 Accès aux services

| Service | Development | Production |
|---------|-------------|------------|
| WebApp | http://localhost:3000 | https://www.example.com |
| PostgreSQL | localhost:5432 | postgres:5432 |
| Traefik Dashboard | http://localhost:8080 | - |

## 🔍 Monitoring et logs

```bash
# Logs de l'application
docker-compose logs -f webapp

# Logs de la base de données
docker-compose logs -f postgres

# Logs Traefik
docker-compose logs -f traefik

# État des conteneurs
docker-compose ps
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion DB**: Vérifier que PostgreSQL est démarré
2. **Port 3000 occupé**: Changer le port dans docker-compose.yml
3. **Permissions Docker**: Ajouter l'utilisateur au groupe docker

### Commandes utiles

```bash
# Reconstruire l'image
docker-compose build --no-cache webapp

# Reset complet
docker-compose down -v
docker-compose up -d

# Accéder au conteneur
docker-compose exec webapp sh
```

## 📚 Documentation

- [Next.js 15](https://nextjs.org/docs)
- [Kysely](https://kysely.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Traefik](https://doc.traefik.io/traefik/)
- [Docker Compose](https://docs.docker.com/compose/)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT.