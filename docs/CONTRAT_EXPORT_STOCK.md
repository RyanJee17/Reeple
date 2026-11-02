# Export de stock — contrat du prototype

Ce format est implémenté localement. Il reste une **hypothèse à valider avec un export réel de caisse**, pas un connecteur universel ni un contrat commercial validé.

## Fichier et instantané

- CSV UTF-8, virgule ou point-virgule, champs entre guillemets pris en charge.
- Une référence par ligne ; identifiant unique, stable entre les exports.
- Maximum 10 000 références et 2 Mio par fichier.
- Import atomique : toute ligne invalide bloque l’import.
- La date de génération de l’export est saisie explicitement, séparément de la date d’import. Une date future est refusée.
- Une cadence facultative sert à signaler un export ancien. Aucun import automatique n’est programmé.
- La confirmation remplace l’instantané visible. Les références absentes disparaissent de cette vue. Les décisions précédentes restent dans le journal ; leur ancien stock n’est pas archivé. Sauvegarder l’espace JSON avant remplacement.

## Colonnes

| Colonne | Règle |
| --- | --- |
| `id`, `titre` | Obligatoires, non vides |
| `stock` | Obligatoire, entier positif ou nul ; une case vide n’est pas zéro |
| `editeur`, `famille` | Texte facultatif, utilisé par les filtres |
| `date_entree`, `derniere_vente` | Facultatives, `AAAA-MM-JJ`, au plus tard à la date de l’export |
| `ventes_s01` à `ventes_s12` | Douze semaines complètes, de la plus ancienne à la plus récente ; les douze valeurs entières positives ou nulles, ou tout l’historique absent |
| `couverture_cible_semaines` | Cible explicite, strictement supérieure à zéro |
| `seuil_ventes_semaine` | Seuil explicite, positif ou nul |
| `commande_habituelle` | Quantité habituelle facultative, entière positive ou nulle |
| `prix_achat`, `prix_vente` | Facultatifs, positifs ou nuls ; virgule décimale acceptée (`prix` accepté pour le prix de vente) |

Les champs de profil joueur ne sont pas nécessaires. Une donnée absente demeure inconnue. Le modèle CSV est téléchargeable depuis l’interface.

## Calculs explicites

Les ventes moyennes sont calculées sur les quatre dernières semaines. La couverture correspond au stock divisé par cette moyenne, lorsqu’elle est strictement positive. La quantité proposée est `max(0, ceil(moyenne × cible) − stock)` si les deux données sont disponibles.

Priorité des états : dormant (stock positif, dernière vente connue dépassant le seuil de jours à la date de l’export), surstock (couverture supérieure à la cible), à surveiller (stock positif et ventes sous le seuil), puis OK lorsque les données permettent cette évaluation. Les autres cas sont signalés comme partiels. Une quantité élevée seule ne prouve pas un surstock.

Les prix ne servent pas à inventer une valeur immobilisée. Les commandes en cours, délais fournisseurs, conditionnements, retours et saisonnalités ne sont pas intégrés. Le vendeur ajuste et décide. Retenir une piste ne modifie ni le stock du fichier ni une commande de caisse.

## Points à valider avec la boutique

Source et fréquence d’export, signification de la date d’entrée (première entrée ou dernier réassort), périodes de ventes et semaines sans données, retours, identifiants/éditions, export complet ou partiel, règles de couverture et données de commandes déjà engagées. La capacité d’import ne constitue pas une validation de performance : le graphique limite explicitement le nombre de repères à 750 ; les filtres et le tableau paginé conservent l’accès aux références.
