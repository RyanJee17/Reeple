# Reeple — page principale de stock

## Démarrer

Depuis `frontend/`, avec les dépendances déjà installées :

```powershell
npm run dev -- --configLoader runner
```

Ouvrir l’URL affichée par Vite, habituellement http://localhost:5173. Sur une nouvelle installation, exécuter d’abord `npm install`. Le frontend fonctionne seul pour le stock local ; aucune dépendance n’a été ajoutée pour cette adaptation.

## Parcours disponible

L’accueil **Catalogue** combine quatre indicateurs, un graphique ancienneté/ventes, des suggestions en liste ou en cartes et un tableau avec douze semaines de ventes. Recherche, famille, éditeur et filtres d’état portent sur les mêmes références. Les points du graphique sont sélectionnables à la souris et au clavier.

Pour une suggestion, le vendeur peut retenir une piste : ajuster la prochaine commande, remettre en avant en rayon ou remettre dans ses conseils. Il décide de la quantité pour une commande, puis valide, ignore ou reporte de 24 h. Le tableau et le journal permettent de rouvrir une décision. La validation enregistre une intention locale ; l’action reste à réaliser en boutique. Aucun stock n’est décrémenté et aucune commande n’est envoyée. Les décisions validées peuvent être exportées en CSV.

Le **Conseil Client** est présenté uniquement comme un futur plugin optionnel payant, hors de cette version principale. L’ancien prototype reste accessible depuis **Paramètres → Aide et contact** ou `/#prototype`. Ses fichiers, dont la recherche BGG, sont conservés.

## Importer un export périodique

Utiliser **Importer un export** dans l’en-tête, ou **Paramètres → Catalogue**. Télécharger le modèle CSV, choisir un fichier, vérifier l’aperçu, renseigner sa date de génération puis confirmer le remplacement de l’instantané.

Seules les colonnes `id;titre;stock` sont obligatoires. L’analyse utilise les dates, les douze semaines de ventes et les seuils lorsqu’ils sont renseignés. Une valeur absente reste inconnue ; aucun profil de joueur n’est exigé. Le contrat complet et les hypothèses à valider avec une boutique sont dans [docs/CONTRAT_EXPORT_STOCK.md](./docs/CONTRAT_EXPORT_STOCK.md).

La date d’export et celle d’import sont distinctes. Une fréquence facultative permet de signaler un export ancien, sans programmer de synchronisation. Exporter l’espace JSON avant remplacement pour conserver l’ancien instantané.

## Données et sauvegardes

La démonstration contient quinze jeux réels avec des stocks, historiques, dates et seuils fictifs. Elle ne correspond pas à une connexion avec la boutique affichée.

Les données et décisions restent dans `localStorage` (`reeple.workspace.v1`), sur cet appareil et cette origine. Les sauvegardes précédentes sont conservées : un ancien catalogue réel apparaît avec ses informations disponibles jusqu’à l’import d’un export de stock. **Paramètres → Aide et contact** permet l’export JSON, la restauration validée et le rechargement de la démonstration avec confirmation.

Pas de PostgreSQL, d’authentification, de synchronisation entre appareils ni de connexion caisse ajoutés. Effacer les données du navigateur peut supprimer l’espace. Un avertissement indique l’échec d’une sauvegarde locale. Éviter plusieurs onglets d’édition simultanés : le dernier enregistrement prévaut. Les 500 dernières entrées d’activité sont conservées.

Le graphique affiche au maximum 750 repères avec un avertissement explicite ; le tableau paginé et les filtres donnent accès à toutes les références. L’import est limité à 10 000 références et 2 Mio. Une recette avec un export réel et des mesures sur plusieurs milliers de références restent nécessaires.

## Design

La composition suit **Maquette · Page principale**. Les variables de couleurs, typographie, espacements et composants viennent exclusivement du **Design System** Figma, exportées en lecture seule dans `frontend/src/reeple/design-system/tokens.css`. Le logo existant du dépôt est conservé. Le détail des sources figure dans le README de ce dossier. L’interface est conçue d’abord pour ordinateur et se réorganise sur écran étroit.

## Vérifier et construire

Depuis `frontend/` :

```powershell
npm test -- --run --configLoader runner
npm run build -- --configLoader runner
npm run preview
```

Vite construit le frontend dans `frontend/build/`. Le contrôle TypeScript global reste affecté par les anciens imports de composants contenant un suffixe de version et des erreurs du prototype. Le build Vite ne remplace pas ce contrôle.

## PWA et hors ligne

Le service worker existant est activé uniquement en production. Après le premier chargement et la préparation du cache, l’interface et les données locales peuvent être disponibles hors ligne. L’installation dépend du navigateur ; un hébergement distant nécessite HTTPS. Le build suppose un hébergement à la racine `/`.

Les origines `localhost:5173` et `127.0.0.1:4173` ont des espaces locaux distincts. Utiliser une sauvegarde JSON pour déplacer les données. Les réponses `/api/` et les images externes BGG ne sont pas mises en cache.

## Backend BGG existant

Le backend n’est pas nécessaire pour la nouvelle page de stock et n’est pas modifié par cette adaptation. Les recherches de l’ancien prototype utilisent ses routes `/api`, jamais le jeton côté React. Pour les activer, lancer `npm run dev` depuis `backend/` et configurer `BGG_API_TOKEN` localement dans `backend/.env` selon `.env.example`. Ne pas publier ce jeton.

L’accès BGG exige une application autorisée et des conditions adaptées à l’usage : [documentation officielle](https://boardgamegeek.com/using_the_xml_api). Avant publication d’un usage commercial, vérifier l’autorisation et l’attribution requises, notamment le logo officiel « Powered by BGG ». Aucun abonnement ni autorisation commerciale n’est souscrit ici. Le routage `/api` du déploiement doit être configuré explicitement : le proxy Vite n’est pas un serveur de production.
