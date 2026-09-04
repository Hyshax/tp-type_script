/**
 * Types et interfaces centraux du jeu TypeQuest.
 * Aucune utilisation de `any` — chaque propriété est strictement typée.
 */

// ─── Classes de héros ───────────────────────────────────────────────

/** Les trois classes jouables du jeu */
export enum HeroClass {
  Guerrier = "Guerrier",
  Mage = "Mage",
  Archer = "Archer",
}

// ─── Statistiques de base ───────────────────────────────────────────

/** Statistiques initiales associées à chaque classe */
export interface BaseStats {
  readonly maxHp: number;
  readonly attack: number;
  readonly defense: number;
}

/** Table de correspondance classe → statistiques initiales */
export const CLASS_BASE_STATS: Readonly<Record<HeroClass, BaseStats>> = {
  [HeroClass.Guerrier]: { maxHp: 120, attack: 15, defense: 10 },
  [HeroClass.Mage]: { maxHp: 80, attack: 25, defense: 5 },
  [HeroClass.Archer]: { maxHp: 100, attack: 20, defense: 7 },
};

// ─── Objets ─────────────────────────────────────────────────────────

/** Catégories d'objets disponibles */
export enum ItemCategory {
  Potion = "Potion",
  Arme = "Arme",
}

/** Représentation d'un objet de l'inventaire */
export interface Item {
  readonly name: string;
  readonly category: ItemCategory;
  readonly value: number;
}

// ─── Monstres ───────────────────────────────────────────────────────

/** Modèle de base pour définir un type de monstre (template) */
export interface MonsterTemplate {
  readonly name: string;
  readonly hp: number;
  readonly attack: number;
  readonly defense: number;
  readonly expReward: number;
  readonly goldReward: number;
}

/** Instance concrète d'un monstre en combat (PV modifiables) */
export interface MonsterInstance {
  readonly name: string;
  readonly maxHp: number;
  currentHp: number;
  readonly attack: number;
  readonly defense: number;
  readonly expReward: number;
  readonly goldReward: number;
}

// ─── Combat ─────────────────────────────────────────────────────────

/** Résultat possible d'un combat */
export enum CombatResult {
  Victoire = "Victoire",
  Defaite = "Defaite",
}

/** Résumé complet d'un combat terminé */
export interface CombatOutcome {
  readonly result: CombatResult;
  readonly monsterName: string;
  readonly expGained: number;
  readonly goldGained: number;
}

// ─── Butin ──────────────────────────────────────────────────────────

/** Résultats possibles du loot après un combat gagné */
export enum LootType {
  Aucun = "Aucun",
  Potion = "Potion",
  Arme = "Arme",
}

// ─── Progression ────────────────────────────────────────────────────

/** Constantes de progression du héros */
export const PROGRESSION = {
  EXP_PER_LEVEL: 100,
  HP_PER_LEVEL: 20,
  ATTACK_PER_LEVEL: 3,
  DEFENSE_PER_LEVEL: 2,
} as const;

// ─── Aventure ───────────────────────────────────────────────────────

/** Nombre de zones à traverser avant le boss final */
export const TOTAL_ZONES = 3;

/** Statistiques de fin de partie */
export interface GameSummary {
  readonly heroName: string;
  readonly heroClass: HeroClass;
  readonly finalLevel: number;
  readonly finalExp: number;
  readonly finalGold: number;
  readonly monstersDefeated: number;
  readonly victory: boolean;
  readonly zoneReached: number;
}
