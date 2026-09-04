import { Hero } from "../models/Hero";
import { MonsterInstance } from "../types/types";
import { damageMonster, isMonsterAlive } from "../models/Monster";
import { CombatResult, CombatOutcome } from "../types/types";
import { Display } from "../ui/Display";

/**
 * Système de combat tour par tour.
 *
 * Gère l'affrontement entre le héros et un monstre,
 * en appliquant les règles de dégâts et en garantissant
 * qu'aucun cas invalide ne se produit (PV négatifs, attaque d'un mort, etc.).
 */
export class CombatSystem {
  /**
   * Calcule les dégâts infligés par un attaquant à une cible.
   *
   * Formule : dégâts = max(1, attaque - défense/2)
   * Garantit un minimum de 1 point de dégât.
   */
  private static calculateDamage(attackPower: number, defensePower: number): number {
    return Math.max(1, Math.floor(attackPower - defensePower / 2));
  }

  /**
   * Lance un combat complet entre le héros et un monstre.
   *
   * Le combat se déroule au tour par tour :
   * 1. Le héros attaque en premier
   * 2. Si le monstre survit, il contre-attaque
   * 3. Répéter jusqu'à la mort d'un combattant
   *
   * Retourne un CombatOutcome exploitable par le reste du programme.
   */
  public static fight(hero: Hero, monster: MonsterInstance): CombatOutcome {
    Display.combatHeader(hero, monster);

    let round = 1;

    while (hero.isAlive() && isMonsterAlive(monster)) {
      Display.roundSeparator(round);

      // ── Tour du héros ──────────────────────────────────────
      const heroDamage = CombatSystem.calculateDamage(hero.attack, monster.defense);
      damageMonster(monster, heroDamage);
      Display.attackMessage(hero.name, monster.name, heroDamage);
      Display.monsterHpBar(monster);

      // Vérifier si le monstre est mort avant qu'il n'attaque
      if (!isMonsterAlive(monster)) {
        break;
      }

      // ── Tour du monstre ────────────────────────────────────
      const monsterDamage = CombatSystem.calculateDamage(monster.attack, hero.defense);
      hero.takeDamage(monsterDamage);
      Display.attackMessage(monster.name, hero.name, monsterDamage);
      Display.heroHpBar(hero);

      round++;
    }

    // ── Résultat du combat ─────────────────────────────────────
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
