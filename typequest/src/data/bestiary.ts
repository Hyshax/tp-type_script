import { MonsterTemplate } from "../types/types";

/**
 * Bestiaire du jeu — définitions des monstres réguliers.
 *
 * Ces templates servent de moules : chaque rencontre génère
 * une instance indépendante à partir de ces données.
 */

export const BESTIARY: ReadonlyArray<MonsterTemplate> = [
  {
    name: "Rat Geant",
    hp: 30,
    attack: 8,
    defense: 2,
    expReward: 25,
    goldReward: 10,
  },
  {
    name: "Gobelin",
    hp: 45,
    attack: 12,
    defense: 4,
    expReward: 40,
    goldReward: 18,
  },
  {
    name: "Troll",
    hp: 70,
    attack: 16,
    defense: 8,
    expReward: 60,
    goldReward: 30,
  },
  {
    name: "Squelette",
    hp: 40,
    attack: 14,
    defense: 3,
    expReward: 35,
    goldReward: 15,
  },
  {
    name: "Loup Sombre",
    hp: 35,
    attack: 18,
    defense: 5,
    expReward: 45,
    goldReward: 20,
  },
];

/**
 * Template du boss final — ne doit JAMAIS apparaître
 * dans les rencontres aléatoires.
 */
export const BOSS_TEMPLATE: MonsterTemplate = {
  name: "Dragon de TypeScript",
  hp: 220,
  attack: 28,
  defense: 12,
  expReward: 150,
  goldReward: 100,
};

/**
 * Sélectionne un monstre aléatoire dans le bestiaire.
 * Le boss final n'est jamais inclus.
 */
export function getRandomMonsterTemplate(): MonsterTemplate {
  const index = Math.floor(Math.random() * BESTIARY.length);
  return BESTIARY[index];
}
