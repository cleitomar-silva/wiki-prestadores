#!/bin/sh
set -e

echo "Aguardando o banco de dados MySQL..."

i=0
until php /usr/local/bin/wait-for-db.php > /dev/null 2>&1; do
    i=$((i + 1))
    if [ "$i" -gt 60 ]; then
        echo "Banco de dados nao acessivel apos 120s. Saindo."
        exit 1
    fi
    sleep 2
done

php artisan migrate --force

HAS_PROCEDURES="$(php artisan tinker --execute="echo App\Models\Procedure::query()->exists() ? 'yes' : 'no';" 2>/dev/null)"
if [ "$HAS_PROCEDURES" != "yes" ]; then
    echo "Tabela procedures vazia. Executando seed inicial..."
    php artisan db:seed --force
fi

echo "Backend pronto. Executando Apache..."

exec apache2-foreground
