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

/**
 * Moteur principal de l'aventure TypeQuest.
 *
 * Orchestre la création du héros, la traversée des zones,
 * les combats, le butin, et le boss final.
 */
export class Adventure {
  private hero!: Hero;
  private monstersDefeated: number = 0;

  // ─── Création du héros ─────────────────────────────────────────

  /**
   * Demande au joueur de choisir un nom et une classe.
   * Empêche l'utilisation d'une classe inexistante.
   */
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

  // ─── Menu entre les combats ────────────────────────────────────

  /**
   * Affiche le menu d'actions entre deux combats.
   * Le joueur peut consulter son inventaire, utiliser un objet,
   * voir sa fiche, ou continuer l'aventure.
   */
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

  /**
   * Sous-menu pour utiliser un objet de l'inventaire.
   */
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

  // ─── Récompenses post-combat ──────────────────────────────────

  /**
   * Applique les récompenses après une victoire :
   * expérience, or, passage de niveau, et butin.
   */
  private applyRewards(expGained: number, goldGained: number): void {
    // Expérience et niveaux
    const levelsGained = this.hero.gainExperience(expGained);

    if (levelsGained > 0) {
      Display.levelUp(this.hero, levelsGained);
    }

    // Or
    this.hero.gainGold(goldGained);

    // Butin aléatoire
    const loot = LootSystem.generateLoot();

    if (loot !== null) {
      Display.lootFound(loot);
      this.hero.addItem(loot);
    } else {
      Display.noLoot();
    }
  }

  // ─── Boucle principale ────────────────────────────────────────

  /**
   * Lance l'aventure complète :
   * 1. Création du héros
   * 2. Traversée de 3 zones avec monstres aléatoires
   * 3. Boss final si le héros a survécu
   * 4. Affichage du résumé
   */
  public start(): void {
    this.createHero();
    this.monstersDefeated = 0;

    // ── Traversée des zones ──────────────────────────────────
    for (let zone = 1; zone <= TOTAL_ZONES; zone++) {
      const zoneName = ZONE_NAMES[zone - 1];
      const monsterTemplate = getRandomMonsterTemplate();
      const monster = createMonsterInstance(monsterTemplate);

      Display.zoneEntry(zone, zoneName, monster.name);

      // Attente avant le combat
      readlineSync.question("  Appuyez sur Entree pour combattre...");

      const outcome = CombatSystem.fight(this.hero, monster);

      if (outcome.result === CombatResult.Defaite) {
        Display.defeat(this.hero, zone);
        this.displaySummary(false, zone);
        return;
      }

      // Victoire — appliquer les récompenses
      this.monstersDefeated++;
      this.applyRewards(outcome.expGained, outcome.goldGained);

      // Menu entre les combats (sauf avant le boss)
      if (zone < TOTAL_ZONES) {
        this.betweenCombatMenu();
      }
    }

    // ── Boss final ───────────────────────────────────────────
    Display.bossEntry();
    readlineSync.question("  Appuyez sur Entree pour affronter le Dragon...");

    // Menu optionnel avant le boss
    this.betweenCombatMenu();

    const boss = createMonsterInstance(BOSS_TEMPLATE);
    const bossOutcome = CombatSystem.fight(this.hero, boss);

    if (bossOutcome.result === CombatResult.Defaite) {
      Display.defeat(this.hero, TOTAL_ZONES + 1);
      this.displaySummary(false, TOTAL_ZONES + 1);
      return;
    }

    // Victoire finale !
    this.monstersDefeated++;
    this.applyRewards(bossOutcome.expGained, bossOutcome.goldGained);

    Display.victory();
    this.displaySummary(true, TOTAL_ZONES + 1);
  }

  // ─── Résumé de fin de partie ──────────────────────────────────

  /**
   * Affiche le résumé complet de la partie.
   */
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
