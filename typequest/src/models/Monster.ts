import { MonsterTemplate, MonsterInstance } from "../types/types";

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

export function damageMonster(monster: MonsterInstance, amount: number): number {
  const effectiveDamage = Math.max(0, amount);
  monster.currentHp = Math.max(0, monster.currentHp - effectiveDamage);
  return effectiveDamage;
}

export function isMonsterAlive(monster: MonsterInstance): boolean {
  return monster.currentHp > 0;
}
