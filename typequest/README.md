Projet réaliser par :
Lafolie Jacques
Marchiset Mattéo

# TypeQuest

Nom :  
Prenom :  

## Installation

```bash
git clone <url-du-repo>
cd typequest
npm install
```

## Lancement

```bash
npm start
```

## Fonctionnalites realisees

### Partie 1 - Creation du heros

- Choix du nom via le terminal
- Trois classes disponibles : Guerrier, Mage, Archer
- Chaque classe possede des statistiques initiales differentes (PV, attaque, defense)
- Utilisation d'un enum `HeroClass` pour empecher l'utilisation d'une classe inexistante
- Affichage de la fiche du heros apres creation

### Partie 2 - Monstres

- Cinq monstres differents : Rat Geant, Gobelin, Troll, Squelette, Loup Sombre
- Chaque monstre possede des PV, attaque, defense, recompense en XP et en or
- Rencontre aleatoire a chaque zone
- Chaque rencontre cree une instance independante (un Gobelin blesse ne rend pas les autres blesses)

### Partie 3 - Systeme de combat

- Combat au tour par tour
- Le heros attaque en premier
- Formule de degats : `max(1, attaque - defense / 2)`
- Minimum 1 point de degat garanti
- Les PV ne descendent jamais en dessous de 0
- Un personnage mort ne peut pas attaquer
- Le combat s'arrete immediatement a la mort d'un combattant
- Le resultat du combat est retourne sous forme d'un `CombatOutcome` exploitable

### Partie 4 - Inventaire

- Deux categories d'objets : Potion et Arme
- Potions : restaurent des PV sans depasser le maximum
- Armes : augmentent l'attaque de facon permanente
- L'objet est retire de l'inventaire apres utilisation
- Menu pour consulter et utiliser les objets entre les combats

### Partie 5 - Experience et niveaux

- Gain d'XP et d'or apres chaque victoire
- Passage de niveau tous les 100 XP
- Amelioration des stats a chaque niveau : +20 PV max, +3 attaque, +2 defense
- PV entierement restaures au passage de niveau
- Support du gain de plusieurs niveaux en une seule fois

### Partie 6 - Aventure complete

- 3 zones a traverser (Foret des Types, Cavernes des Interfaces, Marais des Generiques)
- Monstre aleatoire dans chaque zone
- Butin aleatoire apres chaque victoire (60% rien, 30% potion, 10% arme)
- Continuite des stats du heros entre les zones
- Menu entre les combats pour gerer l'inventaire
- Arret immediat en cas de defaite

### Partie 7 - Boss final

- Le Dragon de TypeScript (220 PV, 28 ATK, 12 DEF)
- Apparait uniquement apres les 3 zones, jamais en rencontre aleatoire
- Ecran de victoire et resume de la partie en cas de succes

## Structure du projet

```
typequest/
  src/
    types/
      types.ts          <- Enums, interfaces, constantes
    models/
      Hero.ts           <- Classe du heros (stats, inventaire, XP)
      Monster.ts        <- Creation et gestion des monstres
    data/
      bestiary.ts       <- Definitions des monstres et du boss
      items.ts          <- Catalogue de potions et armes
      zones.ts          <- Noms des zones
    systems/
      CombatSystem.ts   <- Systeme de combat tour par tour
      LootSystem.ts     <- Systeme de butin aleatoire
    ui/
      Display.ts        <- Affichage terminal centralise
    game/
      Adventure.ts      <- Boucle de jeu principale
    index.ts            <- Point d'entree
  package.json
  tsconfig.json
  README.md
```

## Difficultes rencontrees

- Gestion de l'encodage des caracteres dans le terminal Windows (accents et caracteres speciaux non supportes par defaut)
- Organisation du projet en plusieurs fichiers tout en gardant une structure coherente et lisible
- Gestion des cas limites dans le systeme de combat (degats negatifs, PV negatifs, attaque d'un mort)
- Implementation du gain de plusieurs niveaux en une seule fois avec les bonnes statistiques
