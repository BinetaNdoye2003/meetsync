# MeetSync — Système de gestion de réunions

Plateforme collaborative pour planifier des réunions,
inviter des participants et envoyer des rappels automatiques.

## Stack technique
- **Backend** : Laravel 9 + Sanctum (API REST)
- **Frontend** : React 18 + Vite + Zustand
- **Base de données** : MySQL
- **Emails** : Mailtrap (dev)

## Installation Backend (Laravel)
```bash
cd meetsync-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## Installation Frontend (React)
```bash
cd meetsync-app
npm install
npm run dev
```

## Comptes de démonstration

| Email | Mot de passe |
|-------|-------------|
| alice@meetsync.app | password123 |
| bob@meetsync.app | password123 |
| carol@meetsync.app | password123 |

## Fonctionnalités principales
- Inscription et connexion sécurisée (Sanctum)
- Créer une réunion avec titre, date, durée, lieu
- Inviter des participants avec email automatique
- Répondre aux invitations (Accepter / Refuser)
- Rappels automatiques 15 min avant (Task Scheduler)
- Dashboard avec statistiques et alertes visuelles

## Commande Cron (serveur production)
```
* * * * * cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1
```