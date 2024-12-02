# syntax=docker/dockerfile:1

# Définir la version de Node.js que tu veux utiliser
ARG NODE_VERSION=20.17.0

# Utiliser une image Node.js alpine pour minimiser la taille du conteneur
FROM node:${NODE_VERSION}-alpine

# Définir l'environnement en mode production
ENV NODE_ENV production

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances de production uniquement
RUN npm install --production

# Exposer le port 3000 (pour correspondre à ce qui est défini dans docker-compose.yml)
EXPOSE 3000

# Copier tous les fichiers restants dans le conteneur
COPY . .

# Changer d'utilisateur pour "node" pour plus de sécurité
USER node

# Lancer l'application avec la commande "npm start"
CMD ["npm", "start"]
