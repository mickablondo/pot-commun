# Pot Commun

Application de suivi d'epargne : tu enregistres tes petits gains (vide-grenier, Vinted, cadeaux...)
et tu vois sur une jauge unique a quel point tu es proche de tes objectifs (PS5, Thermomix...).
Recuperer un objectif deduit son prix du solde total (le solde peut devenir negatif).

## Architecture

```
potcommun/
├── backend/     Spring Boot (Java 17) + H2 en mode fichier
└── frontend/    Angular 18 (standalone components)
```

## Lancer le backend

Prerequis : Java 17+ et Maven (ou utilise le wrapper si tu en ajoutes un).

```bash
cd backend
mvn spring-boot:run
```

L'API demarre sur `http://localhost:8080`. La base H2 est stockee dans `backend/data/potcommun.mv.db`
et persiste entre les redemarrages. Console H2 disponible sur `http://localhost:8080/h2-console`
(JDBC URL : `jdbc:h2:file:./data/potcommun`, user `sa`, pas de mot de passe).

### Endpoints principaux

- `GET /api/gains` / `POST /api/gains` / `DELETE /api/gains/{id}`
- `GET /api/objectifs` (optionnellement `?statut=DISPONIBLE` ou `?statut=RECUPERE`)
- `POST /api/objectifs` (creer un objectif)
- `POST /api/objectifs/{id}/recuperer` (marquer comme recupere, deduit du solde)
- `GET /api/solde` (solde courant = somme des gains - somme des objectifs recuperes)

## Lancer le frontend

Prerequis : Node.js 18+ et npm.

```bash
cd frontend
npm install
npm start
```

L'appli est servie sur `http://localhost:4200` et appelle le backend sur `http://localhost:8080`.

## Prochaines etapes possibles

- Suppression/edition d'un objectif ou d'un gain
- Graphique de repartition des gains par source (ngx-charts ou Chart.js)
- Authentification si tu veux rendre l'appli multi-utilisateur
- Remplacer les `location.reload()` (solution rapide de depart) par un vrai partage d'etat
  reactif entre composants via les services (`SoldeService` est deja pret pour ca)
