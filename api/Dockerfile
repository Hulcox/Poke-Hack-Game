FROM node:20-alpine

WORKDIR /app

# Installer netcat pour le script d'entrypoint
RUN apk add --no-cache netcat-openbsd

# Copier uniquement les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (inclut les devDependencies pour tsx)
RUN npm install

# Forcer la reconstruction d'esbuild pour la plateforme Linux
RUN npm rebuild esbuild

# Copier le reste du code
COPY . .

# Générer les fichiers Prisma
RUN npx prisma generate

# Copier et rendre exécutable le script d'entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exposer le port 3030
EXPOSE 3030

ENTRYPOINT ["docker-entrypoint.sh"]
