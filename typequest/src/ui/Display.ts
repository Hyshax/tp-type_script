import { Hero } from "../models/Hero";
import {
  MonsterInstance,
  CombatOutcome,
  CombatResult,
  GameSummary,
  HeroClass,
  Item,
  TOTAL_ZONES,
} from "../types/types";

/**
 * Module d'affichage dans le terminal.
 *
 * Centralise toutes les sorties console du jeu
 * pour une présentation cohérente et lisible.
 */
export class Display {
  // ─── Utilitaires d'affichage ───────────────────────────────────

  private static readonly LINE = "==============================";
  private static readonly THIN_LINE = "------------------------------";

  private static printLine(): void {
    console.log(Display.LINE);
  }

  private static printThinLine(): void {
    console.log(Display.THIN_LINE);
  }

  private static blank(): void {
    console.log();
  }

  // ─── Écran titre ───────────────────────────────────────────────

  public static title(): void {
    Display.blank();
    Display.printLine();
    console.log("          -*- TYPEQUEST -*-");
    Display.printLine();
    Display.blank();
  }

  // ─── Affichage du héros ────────────────────────────────────────

  public static heroSheet(hero: Hero): void {
    Display.blank();
    Display.printLine();
    console.log("        FICHE DU HEROS");
    Display.printLine();
    console.log(`  Nom       : ${hero.name}`);
    console.log(`  Classe    : ${hero.heroClass}`);
    console.log(`  PV        : ${hero.currentHp} / ${hero.maxHp}`);
    console.log(`  Attaque   : ${hero.attack}`);
    console.log(`  Defense   : ${hero.defense}`);
    console.log(`  Niveau    : ${hero.level}`);
    console.log(`  Experience: ${hero.experience}`);
    console.log(`  Or        : ${hero.gold}`);
    Display.printLine();
    Display.blank();
  }

  // ─── Sélection de classe ──────────────────────────────────────

  public static classSelection(): void {
    Display.blank();
    console.log("  Choisissez votre classe :");
    console.log();
    console.log("  1 - Guerrier  (PV: 120 | ATK: 15 | DEF: 10)");
    console.log("  2 - Mage      (PV: 80  | ATK: 25 | DEF: 5)");
    console.log("  3 - Archer    (PV: 100 | ATK: 20 | DEF: 7)");
    Display.blank();
  }

  public static classIndexToEnum(index: number): HeroClass | null {
    switch (index) {
      case 1: return HeroClass.Guerrier;
      case 2: return HeroClass.Mage;
      case 3: return HeroClass.Archer;
      default: return null;
    }
  }

  // ─── Combat ────────────────────────────────────────────────────

  public static combatHeader(hero: Hero, monster: MonsterInstance): void {
    Display.blank();
    Display.printLine();
    console.log("          -*- COMBAT -*-");
    Display.printLine();
    Display.blank();
    console.log(`  ${hero.name}`);
    console.log(`  ${hero.currentHp} / ${hero.maxHp} PV`);
    console.log();
    console.log("          VS");
    console.log();
    console.log(`  ${monster.name}`);
    console.log(`  ${monster.currentHp} / ${monster.maxHp} PV`);
    Display.blank();
    Display.printThinLine();
  }

  public static roundSeparator(round: number): void {
    Display.blank();
    console.log(`  -- Tour ${round} --`);
    Display.blank();
  }

  public static attackMessage(attackerName: string, targetName: string, damage: number): void {
    console.log(`  ${attackerName} attaque ${targetName}.`);
    console.log(`  >> ${damage} degats !`);
  }

  public static heroHpBar(hero: Hero): void {
    console.log(`  ${hero.name} : ${hero.currentHp} / ${hero.maxHp} PV`);
    Display.blank();
  }

  public static monsterHpBar(monster: MonsterInstance): void {
    console.log(`  ${monster.name} : ${monster.currentHp} / ${monster.maxHp} PV`);
    Display.blank();
  }

  public static combatResult(outcome: CombatOutcome): void {
    Display.blank();
    Display.printThinLine();

    if (outcome.result === CombatResult.Victoire) {
      console.log(`  [V] Victoire contre ${outcome.monsterName} !`);
      console.log(`  +${outcome.expGained} EXP | +${outcome.goldGained} Or`);
    } else {
      console.log(`  [X] Defaite contre ${outcome.monsterName}...`);
    }

    Display.printThinLine();
    Display.blank();
  }

  // ─── Zones ─────────────────────────────────────────────────────

  public static zoneEntry(zoneNumber: number, zoneName: string, monsterName: string): void {
    Display.blank();
    Display.printLine();
    console.log(`  > ZONE ${zoneNumber} / ${TOTAL_ZONES}`);
    console.log(`  Vous avancez dans ${zoneName}...`);
    Display.blank();
    console.log(`  Un ${monsterName} apparait !`);
    Display.printLine();
  }

  public static bossEntry(): void {
    Display.blank();
    Display.printLine();
    console.log("  <<< BOSS FINAL >>>");
    console.log("  Le Dragon de TypeScript se dresse devant vous !");
    Display.printLine();
  }

  // ─── Inventaire ────────────────────────────────────────────────

  public static inventory(items: ReadonlyArray<Item>): void {
    Display.blank();
    console.log("  ======== INVENTAIRE ========");

    if (items.length === 0) {
      console.log("  (vide)");
    } else {
      items.forEach((item, index) => {
        console.log(`  ${index + 1} - ${item.name} (${item.category}: ${item.value})`);
      });
    }

    console.log("  ============================");
    Display.blank();
  }

  // ─── Butin ─────────────────────────────────────────────────────

  public static lootFound(item: Item): void {
    console.log(`  [+] Vous trouvez : ${item.name} (${item.category}, valeur: ${item.value})`);
  }

  public static noLoot(): void {
    console.log("  Aucun objet trouve.");
  }

  // ─── Progression ──────────────────────────────────────────────

  public static levelUp(hero: Hero, levelsGained: number): void {
    for (let i = 0; i < levelsGained; i++) {
      console.log(`  >> Niveau superieur ! Vous etes maintenant niveau ${hero.level - levelsGained + i + 1} !`);
    }
    console.log(`  PV max: ${hero.maxHp} | ATK: ${hero.attack} | DEF: ${hero.defense}`);
    console.log(`  PV entierement restaures !`);
  }

  // ─── Fin de partie ────────────────────────────────────────────

  public static defeat(hero: Hero, zoneReached: number): void {
    Display.blank();
    Display.printLine();
    console.log("          -*- DEFAITE -*-");
    Display.blank();
    console.log(`  ${hero.name} est tombe au combat.`);
    console.log(`  Zone atteinte : ${zoneReached} / ${TOTAL_ZONES}`);
    console.log(`  Niveau : ${hero.level}`);
    Display.printLine();
    Display.blank();
  }

  public static victory(): void {
    Display.blank();
    console.log("  +================================+");
    console.log("  |                                |");
    console.log("  |       *** VICTOIRE ***         |");
    console.log("  |                                |");
    console.log("  |  Le Dragon de TypeScript       |");
    console.log("  |  a ete vaincu !                |");
    console.log("  |                                |");
    console.log("  +================================+");
    Display.blank();
  }

  public static gameSummary(summary: GameSummary): void {
    Display.blank();
    console.log("  ======== STATISTIQUES ========");
    console.log(`  Heros           : ${summary.heroName}`);
    console.log(`  Classe          : ${summary.heroClass}`);
    console.log(`  Niveau final    : ${summary.finalLevel}`);
    console.log(`  Experience      : ${summary.finalExp}`);
    console.log(`  Or              : ${summary.finalGold}`);
    console.log(`  Monstres vaincus: ${summary.monstersDefeated}`);
    Display.printLine();
    Display.blank();
  }

  // ─── Actions entre combats ────────────────────────────────────

  public static betweenCombatMenu(): void {
    Display.blank();
    console.log("  Que souhaitez-vous faire ?");
    console.log("  1 - Continuer l'aventure");
    console.log("  2 - Voir l'inventaire");
    console.log("  3 - Utiliser un objet");
    console.log("  4 - Voir la fiche du heros");
    Display.blank();
  }

  public static invalidInput(): void {
    console.log("  /!\ Choix invalide, veuillez reessayer.");
  }

  public static prompt(message: string): void {
    process.stdout.write(`  ${message}`);
  }
}
