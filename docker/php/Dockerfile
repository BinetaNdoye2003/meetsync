# Image de base PHP 8.2 avec PHP-FPM
FROM php:8.3-fpm

# Installer les dépendances système nécessaires pour Laravel
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
  && rm -rf /var/lib/apt/lists/*

# Installer les extensions PHP requises par Laravel
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

# Copier Composer depuis son image officielle
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définir le répertoire de travail dans le conteneur
WORKDIR /var/www
