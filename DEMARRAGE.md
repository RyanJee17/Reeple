# Reeple — version locale adaptée à la maquette

## Ouvrir l’application

Dans un terminal, à la racine du projet :

```powershell
cd frontend
npm install
npm run dev
```

Ouvrir **http://localhost:5173**. Les dépendances étaient déjà présentes lors de l’adaptation ; `npm install` est nécessaire sur une nouvelle installation.

Le frontend fonctionne seul pour les données locales. La recherche en ligne BoardGameGeek nécessite le backend et un jeton BGG configuré (voir ci-dessous). Aucun service cloud n’est nécessaire.

## Ajouter de vrais jeux depuis BoardGameGeek

**Catalogue vivant → Chercher sur BGG** (aussi disponible dans Réglages → Catalogue).

1. Recherchez le titre du jeu, puis ouvrez sa fiche. L’identifiant et l’année permettent de distinguer les éditions et homonymes.
2. Le titre, la photo, les joueurs, l’âge, la durée, la complexité et la note sont récupérés lorsqu’ils existent dans l’API BGG. Les catégories et mécaniques BGG sont conservées avec l’identifiant et la date de récupération.
3. Renseignez **votre stock et votre prix** : ils ne sont pas disponibles comme données de votre boutique dans BGG. Qualifiez les ambiances de conseil et complétez les champs absents.
4. Créez une référence ou choisissez explicitement la référence existante à enrichir. La fiche conserve un lien et une attribution BoardGameGeek. L’import ne crée ni vente ni date de réception fictive.

### Activer la connexion côté développeur

L’API officielle exige une application approuvée et un jeton : [instructions BGG](https://boardgamegeek.com/using_the_xml_api), [gestion des applications](https://boardgamegeek.com/applications). Une demande peut nécessiter un délai d’approbation. Choisir le type d’utilisation correspondant réellement au projet ; une application commerciale doit suivre les conditions commerciales de BGG. Aucun abonnement ni demande de licence n’a été souscrit lors de cette intégration.

Créer `backend/.env` à partir de `backend/.env.example`, puis y renseigner localement :

```dotenv
PORT=3000
BGG_API_TOKEN=votre_jeton_personnel_d_application
```

Ne pas mettre le jeton dans le frontend ni dans Git. Ne pas le partager dans une conversation. Dans deux terminaux :

```powershell
# Terminal API, depuis la racine
cd backend
npm run dev
```

```powershell
# Terminal interface, depuis la racine
cd frontend
npm run dev
```

Le backend écoute uniquement en local sur `127.0.0.1:3000`. Les proxys Vite de développement et d’aperçu transmettent `/api` à ce backend. Pour un déploiement distant, configurer explicitement le routage `/api` et le réseau du serveur.

Les requêtes BGG sont envoyées côté serveur avec un délai entre appels, une file bornée, un cache mémoire limité et un délai maximal par requête. Absence de jeton, refus d’accès, résultat en préparation ou limite de requêtes sont signalés sans inventer de fiches de remplacement. Le cache est perdu au redémarrage du backend. L’authentification des utilisateurs Reeple n’est pas ajoutée par cette fonctionnalité.

Les images BGG sont chargées depuis leur CDN officiel ; elles ne sont pas intégrées au cache hors ligne de la PWA. Si elles ne se chargent pas, le nom du jeu reste visible. Les données importées sont conservées dans la sauvegarde JSON ; le CSV demeure le format des seules données boutique et ne transporte pas les métadonnées BGG.

L’attribution textuelle BGG est présente dans cette version locale. **Avant publication**, intégrer également le logo officiel « Powered by BGG » selon les [conditions BGG](https://boardgamegeek.com/xmlapi/termsofuse) et obtenir l’autorisation correspondant à l’usage commercial prévu. Les tarifs et conditions sont fixés par BGG ; aucune gratuité commerciale permanente n’est promise.

## Ce qui fonctionne

- **Mode conseil** : six questions facultatives, retour aux réponses, filtrage déterministe du catalogue, état sans résultat, détail du jeu et enregistrement d’un conseil. Le compteur évolue ; le stock n’est jamais décrémenté par un conseil.
- **Catalogue vivant** : filtres, recherche, sélection d’une référence, contexte boutique et suggestions expliquées. Les actions « terminé » et « plus tard » sont conservées. Un report dure 24 h, puis la suggestion redevient visible au prochain affichage. Le journal permet de rouvrir une action.
- **Réglages boutique** : identité, adresse, description, prénom, email de profil et logo local PNG/JPEG/WebP (500 Ko maximum). Aucun compte de connexion n’est créé.
- **Catalogue** : import CSV avec validation de toutes les lignes avant confirmation, aperçu, remplacement ou fusion par identifiant, export CSV et édition du stock, des prix et des dates.
- **Préférences** : seuil de dormance (90 jours par défaut), nouveauté en boutique (60 jours) et conseil limité aux jeux en stock.
- **Aide et journal** : explications, historique local, export complet JSON, restauration validée et rechargement de démonstration avec confirmation.
- **Ancien prototype** : conservé dans `src/LegacyApp.tsx` et accessible par Réglages → Aide et contact, ou `/#prototype`. Les anciens fichiers et leurs modifications ont été conservés, dont la recherche BoardGameGeek.

### Règles des suggestions

Les suggestions sont des règles simples et explicites, sans appel à un service d’IA :

- dormant : jeu en stock avec une date de dernière vente connue dépassant le seuil ; une date absente n’est pas assimilée à une absence de vente ;
- sortie à arbitrer : date d’entrée dans la boutique connue, dans la fenêtre de nouveauté ; cette date n’est pas une sortie nationale ;
- bundle : au moins une ambiance commune avec une autre référence en stock ; aucune remise n’est créée ;
- tendance : au moins deux conseils enregistrés dans cet espace ; il ne s’agit pas d’une analyse des achats des clients.

Les tranches de joueurs utilisent une intersection (un jeu à 3 joueurs peut apparaître pour « 3–4 ») et le vendeur confirme le nombre exact. Le filtre d’âge prend le bas de la tranche pour ne pas recommander un jeu trop âgé au plus jeune. Les données d’âge, de durée et de complexité de démonstration restent indicatives.

## Installer la PWA / utiliser hors ligne

Le service worker s’active uniquement sur la **version de production**, pour éviter de conserver un ancien code pendant le développement.

```powershell
cd frontend
npm run build
npm run preview
```

Ouvrir l’adresse locale affichée par Vite (habituellement **http://127.0.0.1:4173**). Après un premier chargement en ligne et la préparation du cache, l’interface, les photos et la police locale sont disponibles hors ligne. Le navigateur compatible propose l’installation ; sur iOS, utiliser Partager → Sur l’écran d’accueil.

Sur un hébergement distant, **HTTPS est nécessaire**. Le build suppose un hébergement à la racine du domaine (`/`). Une nouvelle version du service worker est proposée avec un bouton de mise à jour. Les réponses `/api/` et les ressources externes de l’ancien prototype ne sont pas mises en cache.

`localhost:5173` et `127.0.0.1:4173` sont des origines différentes : leur stockage n’est pas partagé. Utiliser l’export/restauration JSON pour déplacer l’espace.

## Importer votre catalogue

Réglages → Catalogue → **Modèle CSV**. Colonnes obligatoires :

`id;titre;stock;prix;joueurs_min;joueurs_max;age_min;duree`

Colonnes facultatives : `prix_achat`, `complexite` (1 à 5, défaut 2), `ambiances`, `derniere_vente`, `date_entree`, `saisonnalite`.

- UTF-8 ; séparateur point-virgule ou virgule ; guillemets et virgules décimales pris en charge ;
- dates passées ou du jour au format `AAAA-MM-JJ` ;
- ambiances séparées par `|` : `party`, `strategy`, `story`, `bluff`, `explore`, `replay`, `coop` ;
- stock entier positif ou nul ; identifiants uniques et stables ;
- maximum 10 000 lignes et 2 Mo ;
- aucune importation partielle si une ligne est invalide.

Le mode **remplacement** retire les anciennes références et permet de quitter le catalogue de démonstration. Le mode **fusion** met à jour les identifiants présents et conserve les autres références ; conserver des données de démo maintient le signalement de démonstration. Les imports réinitialisent les actions sur les suggestions. Exporter l’espace JSON avant un remplacement ou une restauration.

## Données et limites

Cette livraison est un **MVP local utilisable**, pas un service SaaS en production. Le premier catalogue est fictif ; prix, stocks, notes, dates et compteurs sont des données de démonstration. La boutique affichée vient de la maquette et ne constitue pas une connexion à son système.

Les données sont sauvegardées dans `localStorage` sous `reeple.workspace.v1`. Elles restent sur cet appareil et ce profil de navigateur. Pas de base PostgreSQL connectée, d’authentification, de gestion multi-boutique, de synchronisation cloud, de transaction de caisse ni d’envoi de messages. Exporter les données régulièrement ; elles ne sont pas chiffrées au repos par l’application. Éviter plusieurs onglets d’édition simultanés (le dernier enregistrement local prévaut).

La capacité dépend du quota du navigateur. Un avertissement signale un échec de sauvegarde et invite à exporter les données. Les 500 dernières entrées du journal sont conservées. Les changements de stock ne rouvrent pas automatiquement une suggestion déjà traitée : utiliser le journal.

Pour un usage réel en équipe, la prochaine étape est le backend authentifié avec stockage PostgreSQL, isolation des boutiques et imports depuis la caisse. Les routes Express et BoardGameGeek déjà présentes restent dans `backend/` et ne sont pas nécessaires au nouveau parcours local. Pour l’ancien prototype BGG, lancer également `cd backend` puis `npm run dev` (API sur le port 3000 ; proxy Vite en développement).

## Design et organisation

Les écrans suivent le PDF fourni : en-tête à deux modes, questionnaire, recommandations illustrées, catalogue à deux colonnes et réglages. L’affichage s’adapte aux téléphones et tablettes ; la disposition change donc selon la largeur.

La palette complète est définie dans `src/reeple/styles.css` : corail `#E55B4F` / `#C64337`, navy `#1A395E` et ivoire `#FAF6F0` / `#F6EEE3`. Le corail 600 est utilisé pour les boutons afin de conserver un texte blanc lisible.

Les photos des trois jeux, le logo boutique et le mot-symbole Reeple proviennent du PDF fourni. Les autres références de démonstration utilisent un emplacement typographique, sans photo de substitution. Montserrat est chargée localement, sous licence SIL OFL incluse dans `src/reeple/assets/`. Les pictogrammes réutilisent Lucide et les panneaux/modales les composants Radix/Card déjà installés.

Code ajouté dans `frontend/src/reeple/` ; aucun service payant ni nouvelle dépendance npm ajouté. Ne pas considérer cette livraison comme une recette de production ou une validation de performance.

## Catalogue de démonstration : vrais jeux, boutique fictive

La démo comprend 15 jeux existants (Azul, The Crew, Wingspan, Splendor, Carcassonne, etc.). Les références BGG, le nombre de joueurs, l’âge et la durée ont été vérifiés manuellement le 15 octobre 2026. Chaque fiche contient un lien vers la page BGG correspondante. Les durées affichées conservent la plage BGG ; les filtres utilisent sa borne haute. Les éditions françaises peuvent différer.

Les prix, stocks, dates de vente, dates de réception, saisons et nombres de conseils sont des exemples fictifs. La complexité et les ambiances sont des indications éditoriales Reeple, pas des statistiques BGG. Les résumés sont rédigés pour la démo ; les notes BGG non synchronisées ne sont pas affichées. Les visuels existants sont conservés ; aucune photo BGG n’est récupérée automatiquement.

Cette démo ne nécessite ni jeton ni connexion à l’API. L’import BGG reste accessible séparément lorsque l’autorisation et le jeton seront disponibles. Au rechargement, les anciennes fiches de démo sont enrichies sans effacer les valeurs de boutique ou les fiches importées via l’API.
