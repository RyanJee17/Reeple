# Reeple — cadrage produit actuel

Ce document décrit le recentrage produit d’octobre 2026. Il remplace le cadrage historique à deux modules de même importance. Il décrit la cible ; toutes les fonctionnalités ci-dessous ne sont pas encore implémentées.

## Proposition de valeur

Reeple lit le stock d’une boutique indépendante de jeux de société, signale ce qui mérite attention et propose des pistes ; le vendeur garde la main.

La cible prioritaire est le gérant d’une boutique indépendante en France. Face à plusieurs milliers de références et à un manque de temps, Reeple aide à décider quoi faire du stock à partir des données dont la boutique dispose déjà.

## Page principale

L’expérience est conçue d’abord pour ordinateur. Une page principale associe la visualisation du stock aux suggestions qui concernent les références visibles : jeux dormants, surstock lorsque les données permettent de le qualifier, jeux à remettre en avant.

Une suggestion doit montrer la référence concernée, les données qui motivent le signal et une piste d’action compréhensible. Le gérant choisit l’action et peut la reporter ou l’écarter. Exemples : ajuster une quantité à commander, remettre un jeu en avant dans le conseil ou modifier son emplacement en magasin.

Une suggestion ne modifie pas automatiquement un stock, une commande ou un agencement. Enregistrer une décision dans Reeple ne signifie pas que l’action a été exécutée dans le logiciel de caisse.

## Conseil Client

Le quiz de recommandation devient un plugin optionnel, payant séparément. Il est présenté comme une évolution possible et sort du périmètre de conception de la page principale actuelle. Les parcours existants peuvent être conservés dans le code sans constituer l’accueil du produit.

## Données : hypothèse à valider

L’entrée retenue est un export périodique de la boutique. Aucune connexion en temps réel n’est promise. La fréquence, le format exact et les colonnes doivent être validés avec un export réel avant de figer un contrat d’import.

L’interface doit distinguer la date à laquelle le stock a été exporté de la date à laquelle le fichier a été importé. Elle doit rendre visible la fraîcheur des données et les champs manquants.

Le contrat envisagé doit couvrir :

- un identifiant de référence stable, un titre et une quantité en stock ;
- la date de l’instantané et, lorsqu’elle est disponible, la date de dernière vente pour examiner la dormance ;
- les prix d’achat lorsque l’on affiche une valeur immobilisée ; une valeur inconnue ne doit pas être remplacée par le prix de vente ;
- des ventes sur une période définie, des réceptions ou commandes et une règle explicite de couverture si l’on veut qualifier un surstock ou suggérer une quantité à commander.

Une quantité élevée seule ne suffit pas à prouver un surstock. Une date de vente absente ne prouve pas l’absence de ventes. Les caractéristiques de jeu nécessaires au quiz ne doivent pas être une condition obligatoire de l’import de stock du produit principal.

Les points restant à valider sont la source et la fréquence d’export, l’identifiant commun entre deux exports, le traitement des références absentes du fichier suivant, les périodes de ventes disponibles et la règle de détection du surstock. Ce document ne présente pas ces hypothèses comme un contrat déjà validé.

## Référence de conception

La page Figma « Maquette · Page principale », notamment le nœud `306:1197` du fichier `ZVZ3e9kgh5OdM9mP5q6yTC`, sert de référence de composition. La page « Design System » de ce même fichier est la référence exclusive pour les composants, couleurs, typographies et états visuels.

## État de l’implémentation locale

L’application active est dans `frontend/src/reeple/`. Elle démarre sur le Catalogue : indicateurs, graphique, suggestions et tableau partagent le même instantané et les mêmes filtres. Les vues liste et cartes, les décisions réversibles et leur export CSV sont disponibles. Les variables du Design System Figma sont conservées dans `design-system/tokens.css` ; la maquette sert uniquement de référence de lecture.

L’import accepte douze semaines de ventes, des dates et des seuils explicites, sans exiger les champs du quiz. Les données manquantes restent inconnues. Les anciennes données locales sont conservées, avec une vue partielle en l’absence de nouvel export. Le Conseil Client apparaît uniquement comme une évolution possible.

Le prototype conserve son stockage dans le navigateur. Le backend existant n’est pas modifié et aucune base de données n’est ajoutée. La validation avec un export réel, la recette métier des seuils et la mesure des performances sur plusieurs milliers de références restent à réaliser. Voir [CONTRAT_EXPORT_STOCK.md](./CONTRAT_EXPORT_STOCK.md).
