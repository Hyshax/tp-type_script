import { Hero } from "../models/Hero";
import { MonsterInstance } from "../types/types";
import { damageMonster, isMonsterAlive } from "../models/Monster";
import { CombatResult, CombatOutcome } from "../types/types";
import { Display } from "../ui/Display";

export class CombatSystem {
  private static calculateDamage(attackPower: number, defensePower: number): number {
    return Math.max(1, Math.floor(attackPower - defensePower / 2));
  }

  public static fight(hero: Hero, monster: MonsterInstance): CombatOutcome {
    Display.combatHeader(hero, monster);

    let round = 1;

    while (hero.isAlive() && isMonsterAlive(monster)) {
      Display.roundSeparator(round);

      const heroDamage = CombatSystem.calculateDamage(hero.attack, monster.defense);
      damageMonster(monster, heroDamage);
      Display.attackMessage(hero.name, monster.name, heroDamage);
      Display.monsterHpBar(monster);

      if (!isMonsterAlive(monster)) {
        break;
      }

      const monsterDamage = CombatSystem.calculateDamage(monster.attack, hero.defense);
      hero.takeDamage(monsterDamage);
      Display.attackMessage(monster.name, hero.name, monsterDamage);
      Display.heroHpBar(hero);

      round++;
    }

    const result: CombatResult = hero.isAlive()
      ? CombatResult.Victoire
      : CombatResult.Defaite;

    const outcome: CombatOutcome = {
      result,
      monsterName: monster.name,
      expGained: result === CombatResult.Victoire ? monster.expReward : 0,
      goldGained: result === CombatResult.Victoire ? monster.goldReward : 0,
    };

    Display.combatResult(outcome);

    return outcome;
  }
}
