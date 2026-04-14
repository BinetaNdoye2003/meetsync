# MeetSync — Système de Gestion de Réunions

> Plateforme collaborative full-stack pour planifier des réunions, 
> inviter des participants et envoyer des rappels automatiques par email.

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Backend | Laravel 9 + Sanctum (API REST) |
| Frontend | React 18 + Vite + Zustand |
| Base de données | MySQL 8 |
| Serveur web | Nginx |
| Conteneurisation | Docker + Docker Compose |
| Emails | Gmail SMTP |
| Graphiques | Recharts |

---

## Structure du Projet
DOCKER_PROJECT/
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   └── php/
│       └── Dockerfile
├── meetsync-api/        # Backend Laravel
├── meetsync-app/        # Frontend React
├── docker-compose.yml
├── .gitignore
└── README.md

---

## Lancer le projet

### Prérequis
- Docker Desktop démarré ✅

### Étape 1 — Cloner le projet
```bash
git clone https://github.com/BinetaNdoye2003/meetsync.git
cd meetsync
```

### Étape 2 — Configurer le .env
```bash
cp meetsync-api/.env.example meetsync-api/.env
```

Ouvrir `meetsync-api/.env` et vérifier :
```dotenv
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=root
```

### Étape 3 — Lancer Docker
```bash
docker-compose up -d --build
```

### Étape 4 — Initialiser Laravel
```bash
docker exec -it laravel_app bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
exit
```

### Accès
| Application | URL |
|-------------|-----|
| React | http://localhost:3000 |
| Laravel API | http://localhost:8000 |
| MySQL | localhost:3308 |

---

## Comptes de Démonstration

| Nom | Email | Mot de passe |
|-----|-------|--------------|
| Fama Diop | fama@meetsync.app | password123 |
| Maguette Ndiaye | maguette@meetsync.app | password123 |
| Papi Fall | papi@meetsync.app | password123 |

---

## Fonctionnalités

- Authentification via Laravel Sanctum
- Création et gestion de réunions
- Invitations par email automatiques
- Répondre aux invitations (Accepter/Refuser)
- Rappels automatiques 15 min avant la réunion
- Dashboard avec statistiques et graphiques
- Calendrier custom (Mois/Semaine/Liste)
- Recherche et filtres des réunions
- Page détail réunion avec participants

---

## Commandes utiles

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Accéder au conteneur Laravel
docker exec -it laravel_app bash

# Vider les caches
docker exec -it laravel_app php artisan config:clear
docker exec -it laravel_app php artisan cache:clear

# Voir les logs
docker-compose logs app
```

---

## Développé par

**Bineta Ndoye** — Projet académique  
Stack : React 18 + Laravel 9 + MySQL + Docker + Nginx