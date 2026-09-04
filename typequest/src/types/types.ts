export enum HeroClass {
  Guerrier = "Guerrier",
  Mage = "Mage",
  Archer = "Archer",
}

export interface BaseStats {
  readonly maxHp: number;
  readonly attack: number;
  readonly defense: number;
}

export const CLASS_BASE_STATS: Readonly<Record<HeroClass, BaseStats>> = {
  [HeroClass.Guerrier]: { maxHp: 120, attack: 15, defense: 10 },
  [HeroClass.Mage]: { maxHp: 80, attack: 25, defense: 5 },
  [HeroClass.Archer]: { maxHp: 100, attack: 20, defense: 7 },
};

export enum ItemCategory {
  Potion = "Potion",
  Arme = "Arme",
}

export interface Item {
  readonly name: string;
  readonly category: ItemCategory;
  readonly value: number;
}

export interface MonsterTemplate {
  readonly name: string;
  readonly hp: number;
  readonly attack: number;
  readonly defense: number;
  readonly expReward: number;
  readonly goldReward: number;
}

export interface MonsterInstance {
  readonly name: string;
  readonly maxHp: number;
  currentHp: number;
  readonly attack: number;
  readonly defense: number;
  readonly expReward: number;
  readonly goldReward: number;
}

export enum CombatResult {
  Victoire = "Victoire",
  Defaite = "Defaite",
}

export interface CombatOutcome {
  readonly result: CombatResult;
  readonly monsterName: string;
  readonly expGained: number;
  readonly goldGained: number;
}

export enum LootType {
  Aucun = "Aucun",
  Potion = "Potion",
  Arme = "Arme",
}

export const PROGRESSION = {
  EXP_PER_LEVEL: 100,
  HP_PER_LEVEL: 20,
  ATTACK_PER_LEVEL: 3,
  DEFENSE_PER_LEVEL: 2,
} as const;

export const TOTAL_ZONES = 3;

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
