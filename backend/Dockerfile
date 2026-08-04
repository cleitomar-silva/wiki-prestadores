FROM composer:2 AS build

WORKDIR /app

COPY . .

RUN composer install --no-dev --prefer-dist --no-progress --no-interaction

FROM php:8.3-apache

RUN docker-php-ext-install pdo_mysql \
    && a2enmod rewrite \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf

WORKDIR /var/www/html

COPY --from=build /app/ /var/www/html/

COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint
COPY docker/wait-for-db.php /usr/local/bin/wait-for-db.php

RUN chmod +x /usr/local/bin/docker-entrypoint \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint"]
