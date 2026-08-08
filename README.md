# Pot Commun

Application de suivi d'epargne qui permet d'enregistrer des petits gains (vide-grenier, Vinted, cadeaux ...) et de voir sur une jauge unique à quel point on est proche (ou pas) de nos objectifs (PS5, Thermomix...).  
Récupérer un objectif déduit son prix du solde total évidemment (attention, le solde peut devenir négatif si vous n'arrivez pas à attendre d'atteindre un palier ! Hihi).

## Architecture

```
potcommun/
├── backend/     Spring Boot (Java 25) + H2 en mode fichier
└── frontend/    Angular 21 (standalone components)
```

## Lancer le backend

Prérequis : Java 25, Spring Boot 4.1.0 et Maven.

```bash
cd backend
mvn spring-boot:run
```

L'API démarre sur `http://localhost:8080`.  
La base H2 est stockée dans `backend/data/potcommun.mv.db`, ce choix pour que la base persiste entre les redémarrages.  
Console H2 disponible sur `http://localhost:8080/h2-console` (JDBC URL : `jdbc:h2:file:./data/potcommun`, user `sa`, pas de mot de passe par défaut => configuration dans application.properties).

### Endpoints principaux

- `GET /api/gains` / `POST /api/gains` / `DELETE /api/gains/{id}`
- `GET /api/objectifs` (en option : `?statut=DISPONIBLE` ou `?statut=RECUPERE`)
- `POST /api/objectifs`
- `POST /api/objectifs/{id}/recuperer` : permet de récupérer un objectif et donc de le déduire du solde
- `GET /api/solde` : solde courant = somme des gains - somme des objectifs récupérés

## Lancer le frontend

Prerequis : Node.js 21 et npm.

```bash
cd frontend
npm install
npm start
```

L'application est disponible sur `http://localhost:4200` et appelle le backend sur `http://localhost:8080`.

![Visu](image.png)

![graphique](repartition.png)

## Sécurité

La sécurité du backend est basée sur des tokens JWT, configurables via des variables d'environnement.

### Vue d'ensemble

- Authentification stateless par JWT (JSON Web Token) ;
- Endpoints publics :
  - POST /api/auth/login : permet l'obtention d'un JWT ;
  - /h2-console/\*\* : console H2 (développement) ;
- Tous les autres endpoints requièrent un JWT valide transmis dans l'en‑tête Authorization: Bearer <JWT> ;
- Profil `dev` : si SPRING_PROFILES_ACTIVE=dev, la sécurité est désactivée pour faciliter le développement local ;

### Configuration

Les paramètres sensibles se mettent dans un fichier .env à la racine du backend (ex : backend/.env) ou via les variables d'environnement du système. Ne commitez pas ce fichier !!

Exemple de fichier .env :

```properties
# DB
DB_URL=jdbc:h2:file:./data/potcommun;AUTO_SERVER=TRUE
DB_USERNAME=sa
DB_PASSWORD=
SERVER_PORT=8080

# Compte autorisé par défaut
INIT_USER_EMAIL=micka@example.com
INIT_USER_PASSWORD=changeMoi
INIT_USER_NAME=Micka

# JWT
JWT_SECRET=un_secret_pas_complique_oups
JWT_EXPIRATION_MS=3600000
```

<i>À noter :</i>

- JWT_SECRET est le secret utilisé pour signer les tokens (doit être long et secret, ex : 32+ caract.) ;
- JWT_EXPIRATION_MS est la durée de validité du token en millisecondes (par défaut 3600000 = 1h) ;

### Mécanique d'authentification

- POST /api/auth/login
  - Requête JSON : { "email": "user@example.com", "password": "votreMotDePasse" }
  - Réponse : { "token": "<JWT>", "nom": "Prénom" }
  - Le token est signé avec JWT_SECRET et expire après JWT_EXPIRATION_MS.

- Les mots de passe sont stockés hachés (BCrypt). InitUsersConfig initialise un utilisateur si la table est vide.

### Appels depuis un client (ex : Postman, frontend Angular)

1. Obtenir le token :
   POST http://localhost:8080/api/auth/login
   Header: Content-Type: application/json
   Body: { "email":"micka@example.com", "password":"changeMoi" }
   -> réponse JSON contenant "token"

2. Appeler un endpoint protégé en spécifiant le token dans l'en-tête Authorization :
   Header: Authorization: Bearer <JWT>
