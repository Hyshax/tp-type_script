import { MonsterTemplate, MonsterInstance } from "../types/types";

/**
 * Crée une instance indépendante d'un monstre à partir d'un template.
 *
 * Chaque appel génère un monstre avec ses propres PV,
 * garantissant l'indépendance entre deux rencontres du même type.
 */
export function createMonsterInstance(template: MonsterTemplate): MonsterInstance {
  return {
    name: template.name,
    maxHp: template.hp,
    currentHp: template.hp,
    attack: template.attack,
    defense: template.defense,
    expReward: template.expReward,
    goldReward: template.goldReward,
  };
}

/**
 * Inflige des dégâts à un monstre.
 * Les PV ne descendent jamais en dessous de 0.
 */
export function damageMonster(monster: MonsterInstance, amount: number): number {
  const effectiveDamage = Math.max(0, amount);
  monster.currentHp = Math.max(0, monster.currentHp - effectiveDamage);
  return effectiveDamage;
}

/** Vérifie si un monstre est encore en vie */
export function isMonsterAlive(monster: MonsterInstance): boolean {
  return monster.currentHp > 0;
}
