import { Item, LootType } from "../types/types";
import { getRandomPotion, getRandomWeapon } from "../data/items";

/**
 * Système de butin après un combat victorieux.
 *
 * Probabilités :
 *   60 % → aucun objet
 *   30 % → potion
 *   10 % → arme
 */
export class LootSystem {
  /**
   * Détermine aléatoirement le type de butin obtenu.
   */
  private static rollLootType(): LootType {
    const roll = Math.random() * 100;

    if (roll < 60) {
      return LootType.Aucun;
    } else if (roll < 90) {
      return LootType.Potion;
    } else {
      return LootType.Arme;
    }
  }

  /**
   * Génère un butin aléatoire.
   * Retourne l'objet obtenu, ou null si aucun butin.
   */
  public static generateLoot(): Item | null {
    const lootType = LootSystem.rollLootType();

    switch (lootType) {
      case LootType.Aucun:
        return null;
      case LootType.Potion:
        return getRandomPotion();
      case LootType.Arme:
        return getRandomWeapon();
    }
  }
}
