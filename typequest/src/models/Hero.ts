import {
  HeroClass,
  CLASS_BASE_STATS,
  Item,
  ItemCategory,
  PROGRESSION,
} from "../types/types";

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

  public isAlive(): boolean {
    return this.currentHp > 0;
  }

  public takeDamage(amount: number): number {
    const effectiveDamage = Math.max(0, amount);
    this.currentHp = Math.max(0, this.currentHp - effectiveDamage);
    return effectiveDamage;
  }

  public heal(amount: number): number {
    const previousHp = this.currentHp;
    this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
    return this.currentHp - previousHp;
  }

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

  private levelUp(): void {
    this.level++;
    this.maxHp += PROGRESSION.HP_PER_LEVEL;
    this.attack += PROGRESSION.ATTACK_PER_LEVEL;
    this.defense += PROGRESSION.DEFENSE_PER_LEVEL;
    this.currentHp = this.maxHp;
  }

  public gainGold(amount: number): void {
    this.gold += amount;
  }

  public addItem(item: Item): void {
    this.inventory.push(item);
  }

  public getInventory(): ReadonlyArray<Item> {
    return [...this.inventory];
  }

  public getInventorySize(): number {
    return this.inventory.length;
  }

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

    this.inventory.splice(index, 1);
    return message;
  }
}
