# TP-Hebergement

# Projet Armoires Électriques

## Description
Ce projet est une application web interactive permettant de gérer les zones d'une mini-usine à travers des armoires électriques et de superviser leurs paramètres (adresses IP, zones, variables associées). Elle fournit également des fonctionnalités d'administration, de visualisation de données historiques, et de modification des configurations.

---

## Fonctionnalités

### 1. Gestion des Armoires Électriques
- Visualisation des armoires électriques par zone.
- Modification des adresses IP des zones via une interface modale.
- Ajout et suppression de variables associées à chaque zone. ( Zone 3 faite en priorité )

### 2. Supervision des Données
- Accès aux valeurs en temps réel des variables.
- Affichage graphique des valeurs historiques.
- Export des données historiques au format CSV.

### 3. Gestion des Utilisateurs
- Gestion des rôles : `Admin`, `Technicien`, et `Viewer`.
- Interface utilisateur personnalisée en fonction du rôle. ( en cours de conception, mise juste du rôle administrateur dans les programmes mais logo et visuel du menu contextuel modifié)
- Ajout d'un utilisateur admin pour nos essaye ( ID : admin MDP : admin.01)
---

## Structure du Projet

### Backend
- **Langage:** Node.js
- **Framework:** Express
- **Base de données:** MariaDB (MySQL compatible)
- **Dossier principal:** `index.js`

### Frontend
- **Langage:** HTML, CSS, JavaScript
- **Framework CSS:** Bootstrap 5.3
- **Bibliothèques supplémentaires:** Chart.js pour les graphiques interactifs.

### Architecture des Fichiers
- **`/frontend`** : Contient les fichiers HTML, CSS, et JavaScript côté client.
- **`index.js`** : Serveur principal côté backend.
- **Base de données** : Gère les tables `automates`, `variables`, et `historique_variables` pour stocker les données des zones et variables associées.

---

## Installation et Lancement

### Pré-requis
- Node.js v14 ou supérieur
- Docker (optionnel, recommandé pour la base de données)
- Navigateur moderne (Chrome, Firefox, Edge)

### Étapes d'installation

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/votre-repo.git
   cd votre-repo
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer la base de données :**
   - Lancer une instance MariaDB avec Docker :
     ```bash
     docker run --name mariadb -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=automate -p 3306:3306 -d mariadb
     ```
   - Configurer le fichier `index.js` avec les bonnes informations de connexion.

4. **Lancer l'application :**
   ```bash
    docker-compose up -d --build  ( lancement du docker avec chargement des données )
    docker-compose exec backend sh ( lancement de la commande backend)
    Node PCL.js ( commande pour lancé le scan modbus TCP IP)

5. **Accéder à l'application :**
   Ouvrez votre navigateur et allez à :
   ```
   http://localhost:3000/Log.html
   ```

---

## Fonctionnement

### Gestion des Zones
- Les zones et leurs informations (nom, IP) sont affichées dynamiquement à partir de la base de données.
- Cliquez sur l'icône engrenage pour modifier l'adresse IP d'une zone.
- Enregistrez les modifications via le formulaire modal.

### Supervision des Variables
- Visualisez les variables de chaque zone via la page associée.
- Exportez les données historiques des variables en CSV pour une analyse externe.
- Les graphiques montrent les données en temps réel et historiques.

### Administration et Sécurité ( en cours de conception )
- Les rôles définissent les actions autorisées :
  - `Admin` : Accès complet (ajout, suppression, modification).
  - `Technicien` : Modification limitée.
  - `Viewer` : Consultation uniquement.

---

## Technologies Utilisées

### Backend
- **Express.js** : Framework web pour gérer les routes et les API REST.
- **MariaDB** : Base de données relationnelle pour stocker les informations des zones et variables.
- **Docker** : Environnement isolé pour MariaDB.

### Frontend
- **HTML5 & CSS3** : Structure et style des pages web.
- **Bootstrap 5.3** : Interface utilisateur réactive et esthétique.
- **Chart.js** : Visualisation des données en graphique.

---

## Points Importants
- **404 lors de la mise à jour des IP :** Assurez-vous que la route `/api/automates/update-ip` est correctement définie dans le backend.
- **Problèmes de connexion :** Vérifiez la configuration des utilisateurs dans la table `operateurs`.
- **Données manquantes :** Vérifiez que les tables `variables` et `automates` contiennent des entrées appropriées.

---


## Des mises a jours seront peut être faite dans les jours suivants

