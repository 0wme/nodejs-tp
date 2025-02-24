# IUT Project - API Movies

J'ai mit des screens que de mon côté l'application fonctionne au cas ou. Je n'ai pas réussi à mettre en place la dernière demande, je pense qu'il fallait utiliser RabbitMQ mais j'ai pas réussi à le mettre en place.

## Description
Ce projet est une API RESTful construite avec Hapi.js permettant de gérer des films et des utilisateurs. L'API offre des fonctionnalités d'authentification, de gestion de films, et inclut un service d'envoi d'emails.

## Prérequis
- Node.js (v14 ou supérieur)
- Docker et Docker Compose
- MySQL (via Docker)

## Installation

1. Cloner le projet :
```bash
git clone <votre-repo>
cd iut-project
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer l'environnement :
Créer un fichier `.env` dans le dossier `server/` avec les variables suivantes :

```env
# Configuration Base de données
DB_HOST=0.0.0.0
DB_USER=root
DB_PASSWORD=hapi
DB_NAME=user
DB_PORT=3307

# Configuration JWT
JWT_SECRET=secret
JWT_EXPIRES_IN=1h

# Configuration Email
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=votre_user
MAIL_PASS=votre_password
```

## Base de données

Le projet utilise MySQL via Docker. Le conteneur est configuré pour exposer MySQL sur le port 3307.

Pour démarrer MySQL :
```bash
docker run --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -p 3307:3306 -d mysql:8.0
```

## Migrations

Le projet utilise Knex pour les migrations de base de données. Les migrations sont exécutées automatiquement au démarrage du serveur (migrateOnStart: true).

Pour exécuter les migrations manuellement :
```bash
npx knex migrate:latest
```

## Démarrage du serveur

Pour lancer le serveur en mode développement :
```bash
npm start
```

Le serveur démarre par défaut sur : http://localhost:3000

## Structure du Projet
- `/lib` : Contient la logique métier
  - `/migrations` : Fichiers de migration de la base de données
  - `/models` : Modèles de données
  - `/routes` : Définition des routes de l'API
  - `/services` : Services métier
- `/server` : Configuration du serveur
- `/test` : Tests

## API Endpoints

### Authentification
- POST `/user`: Création d'un compte
- POST `/user/login`: Connexion

### Films
- GET `/movies`: Liste des films
- POST `/movies`: Ajouter un film
- GET `/movies/{id}`: Détails d'un film
- PUT `/movies/{id}`: Modifier un film
- DELETE `/movies/{id}`: Supprimer un film

## Tests

Pour exécuter les tests :
```bash
npm test
```
<img width="1723" alt="rr" src="https://github.com/user-attachments/assets/450b054d-0593-4465-b7f7-93fdb7b9b42c" />
<img width="1728" alt="image" src="https://github.com/user-attachments/assets/d23654d3-be49-45e0-b00b-d1d069a61048" />

