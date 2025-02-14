#!/bin/sh
# Attendre que le service PostgreSQL soit disponible
while ! nc -z db 5432; do
  echo "En attente de PostgreSQL sur db:5432..."
  sleep 2
done

echo "PostgreSQL est disponible, lancement des migrations..."
npx prisma migrate deploy

npx prisma db seed

echo "Démarrage de l'API..."
npm run dev
