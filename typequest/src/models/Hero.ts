import {
  HeroClass,
  CLASS_BASE_STATS,
  Item,
  ItemCategory,
  PROGRESSION,
} from "../types/types";

/**
 * Classe représentant le héros contrôlé par le joueur.
 *
 * Le héros possède un nom, une classe, des statistiques de combat,
 * un système de niveau / expérience, de l'or et un inventaire d'objets.
 */
export class Hero {
  public readonly name: string;
  public readonly heroClass: HeroClass;

  public maxHp: number;
  public currentHp: number;
  public attack: number;
  public defense: number;
  public level: number;
  public experience: number;
  public gold: number;

  private inventory: Item[];

  constructor(name: string, heroClass: HeroClass) {
    this.name = name;
    this.heroClass = heroClass;

    const stats = CLASS_BASE_STATS[heroClass];
    this.maxHp = stats.maxHp;
    this.currentHp = stats.maxHp;
    this.attack = stats.attack;
    this.defense = stats.defense;

    this.level = 1;
    this.experience = 0;
    this.gold = 0;

    this.inventory = [];
  }

  // ─── État ───────────────────────────────────────────────────────

  /** Vérifie si le héros est encore en vie */
  public isAlive(): boolean {
    return this.currentHp > 0;
  }

  // ─── Dégâts et soins ───────────────────────────────────────────

  /**
   * Inflige des dégâts au héros.
   * Les PV ne descendent jamais en dessous de 0.
   */
  public takeDamage(amount: number): number {
    const effectiveDamage = Math.max(0, amount);
    this.currentHp = Math.max(0, this.currentHp - effectiveDamage);
    return effectiveDamage;
  }

  /**
   * Restaure des points de vie.
   * Les PV ne dépassent jamais maxHp.
   */
  public heal(amount: number): number {
    const previousHp = this.currentHp;
    this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
    return this.currentHp - previousHp;
  }

  // ─── Expérience et niveaux ─────────────────────────────────────

  /**
   * Ajoute de l'expérience et gère le passage de niveau.
   * Supporte le gain de plusieurs niveaux d'un coup.
   * Retourne le nombre de niveaux gagnés.
   */
  public gainExperience(amount: number): number {
    this.experience += amount;
    let levelsGained = 0;

    while (this.experience >= PROGRESSION.EXP_PER_LEVEL) {
      this.experience -= PROGRESSION.EXP_PER_LEVEL;
      this.levelUp();
      levelsGained++;
    }

    return levelsGained;
  }

  /** Monte d'un niveau et améliore les statistiques */
  private levelUp(): void {
    this.level++;
    this.maxHp += PROGRESSION.HP_PER_LEVEL;
    this.attack += PROGRESSION.ATTACK_PER_LEVEL;
    this.defense += PROGRESSION.DEFENSE_PER_LEVEL;
    // Restauration complète des PV au passage de niveau
    this.currentHp = this.maxHp;
  }

  /** Ajoute de l'or au héros */
  public gainGold(amount: number): void {
    this.gold += amount;
  }

  // ─── Inventaire ────────────────────────────────────────────────

  /** Ajoute un objet à l'inventaire */
  public addItem(item: Item): void {
    this.inventory.push(item);
  }

  /** Retourne une copie de l'inventaire (lecture seule) */
  public getInventory(): ReadonlyArray<Item> {
    return [...this.inventory];
  }

  /** Retourne le nombre d'objets dans l'inventaire */
  public getInventorySize(): number {
    return this.inventory.length;
  }

  /**
   * Utilise un objet de l'inventaire par son index (0-based).
   * - Potion : restaure des PV, puis supprimée.
   * - Arme   : augmente l'attaque de façon permanente, puis supprimée.
   * Retourne un message décrivant l'effet, ou null si l'index est invalide.
   */
  public useItem(index: number): string | null {
    if (index < 0 || index >= this.inventory.length) {
      return null;
    }

    const item = this.inventory[index];

    let message: string;

    switch (item.category) {
      case ItemCategory.Potion: {
        const healed = this.heal(item.value);
        message = `${item.name} utilisee ! +${healed} PV (${this.currentHp} / ${this.maxHp})`;
        break;
      }
      case ItemCategory.Arme: {
        this.attack += item.value;
        message = `${item.name} equipee ! Attaque +${item.value} (total : ${this.attack})`;
        break;
      }
    }

    // Retirer l'objet de l'inventaire
    this.inventory.splice(index, 1);
    return message;
  }
}
