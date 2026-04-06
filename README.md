# MeetSync - Projet Fullstack

## Technologies
- Laravel (API)
- React (Frontend)
- MySQL
- Docker

## Lancer le projet

### 1. Cloner le repo
git clone https://github.com/ton-username/meetsync.git

### 2. Configurer l'environnement
cp meetsync-api/.env.example meetsync-api/.env

### 3. Lancer Docker
docker-compose up -d --build

### 4. Migrer la base de données
docker exec -it laravel_app bash
php artisan migrate
exit

## Accès
- Laravel : http://localhost:8000
- React : http://localhost:3000
- MySQL : localhost:3307
