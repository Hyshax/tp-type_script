import { Hero } from "../models/Hero";
import { createMonsterInstance } from "../models/Monster";
import { getRandomMonsterTemplate, BOSS_TEMPLATE } from "../data/bestiary";
import { ZONE_NAMES } from "../data/zones";
import { CombatSystem } from "../systems/CombatSystem";
import { LootSystem } from "../systems/LootSystem";
import { Display } from "../ui/Display";
import {
  CombatResult,
  GameSummary,
  TOTAL_ZONES,
  HeroClass,
} from "../types/types";
import * as readlineSync from "readline-sync";

export class Adventure {
  private hero!: Hero;
  private monstersDefeated: number = 0;

  private createHero(): void {
    Display.title();

    const name = readlineSync.question("  Entrez le nom de votre heros : ");

    Display.classSelection();

    let heroClass: HeroClass | null = null;

    while (heroClass === null) {
      const classInput = readlineSync.questionInt("  Votre choix (1-3) : ");
      heroClass = Display.classIndexToEnum(classInput);

      if (heroClass === null) {
        Display.invalidInput();
      }
    }

    this.hero = new Hero(name, heroClass);
    Display.heroSheet(this.hero);
  }

  private betweenCombatMenu(): void {
    let continueMenu = true;

    while (continueMenu) {
      Display.betweenCombatMenu();
      const choice = readlineSync.questionInt("  Votre choix : ");

      switch (choice) {
        case 1:
          continueMenu = false;
          break;

        case 2:
          Display.inventory(this.hero.getInventory());
          break;

        case 3:
          this.useItemMenu();
          break;

        case 4:
          Display.heroSheet(this.hero);
          break;

        default:
          Display.invalidInput();
          break;
      }
    }
  }

  private useItemMenu(): void {
    const items = this.hero.getInventory();

    if (items.length === 0) {
      console.log("  Votre inventaire est vide.");
      return;
    }

    Display.inventory(items);

    const itemIndex = readlineSync.questionInt(
      `  Quel objet utiliser ? (1-${items.length}, 0 pour annuler) : `
    );

    if (itemIndex === 0) {
      return;
    }

    const result = this.hero.useItem(itemIndex - 1);

    if (result !== null) {
      console.log(`  ${result}`);
    } else {
      Display.invalidInput();
    }
  }

  private applyRewards(expGained: number, goldGained: number): void {
    const levelsGained = this.hero.gainExperience(expGained);

    if (levelsGained > 0) {
      Display.levelUp(this.hero, levelsGained);
    }

    this.hero.gainGold(goldGained);

    const loot = LootSystem.generateLoot();

    if (loot !== null) {
      Display.lootFound(loot);
      this.hero.addItem(loot);
    } else {
      Display.noLoot();
    }
  }

  public start(): void {
    this.createHero();
    this.monstersDefeated = 0;

    for (let zone = 1; zone <= TOTAL_ZONES; zone++) {
      const zoneName = ZONE_NAMES[zone - 1];
      const monsterTemplate = getRandomMonsterTemplate();
      const monster = createMonsterInstance(monsterTemplate);

      Display.zoneEntry(zone, zoneName, monster.name);

      readlineSync.question("  Appuyez sur Entree pour combattre...");

      const outcome = CombatSystem.fight(this.hero, monster);

      if (outcome.result === CombatResult.Defaite) {
        Display.defeat(this.hero, zone);
        this.displaySummary(false, zone);
        return;
      }

      this.monstersDefeated++;
      this.applyRewards(outcome.expGained, outcome.goldGained);

      if (zone < TOTAL_ZONES) {
        this.betweenCombatMenu();
      }
    }

    Display.bossEntry();
    readlineSync.question("  Appuyez sur Entree pour affronter le Dragon...");

    this.betweenCombatMenu();

    const boss = createMonsterInstance(BOSS_TEMPLATE);
    const bossOutcome = CombatSystem.fight(this.hero, boss);

    if (bossOutcome.result === CombatResult.Defaite) {
      Display.defeat(this.hero, TOTAL_ZONES + 1);
      this.displaySummary(false, TOTAL_ZONES + 1);
      return;
    }

    this.monstersDefeated++;
    this.applyRewards(bossOutcome.expGained, bossOutcome.goldGained);

    Display.victory();
    this.displaySummary(true, TOTAL_ZONES + 1);
  }

  private displaySummary(victory: boolean, zoneReached: number): void {
    const summary: GameSummary = {
      heroName: this.hero.name,
      heroClass: this.hero.heroClass,
      finalLevel: this.hero.level,
      finalExp: this.hero.experience,
      finalGold: this.hero.gold,
      monstersDefeated: this.monstersDefeated,
      victory,
      zoneReached,
    };

    Display.gameSummary(summary);
  }
}
