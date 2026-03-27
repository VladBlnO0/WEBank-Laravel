FROM php:8.4-rc-cli

ARG WWWGROUP=1000
ARG WWWUSER=1000

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    curl \
    git \
    libpq-dev \
    libzip-dev \
    unzip \
    zip \
    && docker-php-ext-install \
    bcmath \
    pcntl \
    pdo_pgsql \
    pgsql \
    zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN groupadd --force --gid ${WWWGROUP} app \
    && useradd --uid ${WWWUSER} --gid ${WWWGROUP} --create-home --shell /bin/bash app

USER app

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
