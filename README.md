# Reeple

## Application adaptée à la maquette

La version locale reprend le parcours de conseil, le catalogue vivant et les réglages avec la palette navy/corail/ivoire. Elle comprend l’import CSV, les sauvegardes locales et une PWA pour la version de production. **[Démarrage, fonctionnalités et limites → DEMARRAGE.md](./DEMARRAGE.md)**.

L’ancien prototype est conservé et accessible depuis l’aide de la nouvelle application. Les informations suivantes présentent le contexte initial du projet.

> *"Chaque référence mérite sa chance"*

Reeple est un assistant numérique B2B sur tablette et mobile, conçu pour les gérants de boutiques de jeux de société indépendantes en France et en Belgique. Il aide les vendeurs à conseiller leurs clients et à mieux valoriser leur stock, sans remplacer leur expertise.

Projet réalisé dans le cadre du programme **My Digital Start-up** à MyDigitalSchool (MBA 2025-2027).



## Le produit

Reeple se compose de deux modules complémentaires :

**Conseil Client** : Un quiz guidé en quelques étapes qui aide le vendeur à recommander le jeu idéal en fonction du profil du client (nombre de joueurs, âge, niveau, durée, univers, budget). Le vendeur reste décisionnaire : Reeple propose, il choisit.

**Catalogue Vivant** : Un outil de gestion de stock intelligent qui identifie les jeux dormants, suit l'activité des auteurs et détecte les opportunités de bundles. L'objectif est d'aider le vendeur à redécouvrir son propre catalogue.

Le vendeur reste décisionnaire : Reeple propose, il choisit. 

## Liens

| Ressource       | Lien                                                                                                         |
|-----------------|--------------------------------------------------------------------------------------------------------------|
| Maquette Figma  | [Reeple Maquette](https://www.figma.com/design/ZVZ3e9kgh5OdM9mP5q6yTC/Reeple-Maquette?m=auto&t=reFSGvpGTpnFbJBQ-6) |
| Landing page    | [reeeple.figma.site](https://reeeple.figma.site)                                                             |
| Contact         | [hello.reeple@gmail.com](mailto:hello.reeple@gmail.com)                                                      |



## Stack technique

L'application sera développée sous forme de **PWA en React** avec un backend Node/Express. 

- **Frontend** : PWA React (Vite, TypeScript, Tailwind)
- **Backend** : Node.js / Express (API REST)
- **Prototype UI** : Maquettes haute fidélité sur Figma
- **Backlog** : GitHub Issues + Milestones



## Structure du repo
-# A mettre à jour quand l'architecture évolue

```
Reeple/
├── .github/
│   └── ISSUE_TEMPLATE/        # Templates d'issues projet
├── frontend/                  # Application PWA React (Vite)
│   ├── src/                   # Code source front
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                   # API Node/Express
│   ├── src/                   # Code source back
│   ├── package.json
│   └── tsconfig.json          # Si TypeScript
├── README.md
└── package.json               
```



## Avancement du projet

| Milestone               | Description                                                                                          | Statut        |
|-------------------------|------------------------------------------------------------------------------------------------------|---------------|
| Ms0 - Prototype Figma   | Écrans Conseil Client + Catalogue Vivant, Design System, audits accessibilité et éco-conception     | Terminé       |
| Ms1 - Jalon 2 Business Plan | Priorisation fonctionnalités, roadmap M2/M3, chiffrage UX/UI                                   | En cours      |
| Ms2 - MVP Alpha         | Écrans secondaires, Design System complet, tests utilisateurs                                       | À venir (automne 2026) |
| Ms3 - Jalon 3 Lancement | Prototype final, dossiers individuels, soutenance jury                                             | À venir (printemps 2027) |



## Équipe

| Rôle                    | Spécialité                         |
|-------------------------|------------------------------------|
| UX/UI Design            | MBA Expert UX/UI Design            |
| Direction Artistique    | MBA Direction Artistique Digitale  |
| Marketing               | MBA Expert Marketing Digital (x2)  |
| Développement Full-Stack| MBA Développement Full-Stack       |



## Contexte académique

Ce projet est réalisé dans le cadre du programme **My Digital Start-up** de MyDigitalSchool, déployé sur deux ans (M1 et M2). Il mobilise une approche Lean Startup avec des jalons de validation progressive (Go/No Go, Business Plan, Lancement).

- Jalon 1 (Go/No Go) : validé
- Jalon 2 (Business Plan) : en cours - juin 2026
- Jalon 3 (Réalisation et Lancement) : printemps 2027



## Lancer le projet

### Prérequis

- Node.js LTS
- npm ou pnpm



### 1. Cloner le repo

```bash
git clone <url-du-repo>
cd Reeple
```



### 2. Installer les dépendances

Frontend :

```bash
cd frontend
npm install
```

Backend :

```bash
cd backend
npm install
```



### 3. Lancer le frontend (PWA React)

Depuis le dossier `frontend` :

```bash
npm run dev
```

Par défaut, l’application est accessible sur :  
`http://localhost:5173` 

### 4. Lancer le backend (API)

Depuis le dossier `backend` :

```bash
npm run dev
```

Par défaut, l’API est accessible sur :  
`http://localhost:3000`
