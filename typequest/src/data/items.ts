import { Item, ItemCategory } from "../types/types";

export const POTIONS: ReadonlyArray<Item> = [
  { name: "Potion de soin", category: ItemCategory.Potion, value: 30 },
  { name: "Grande potion de soin", category: ItemCategory.Potion, value: 60 },
  { name: "Elixir de vie", category: ItemCategory.Potion, value: 100 },
];

export const WEAPONS: ReadonlyArray<Item> = [
  { name: "Dague rouillee", category: ItemCategory.Arme, value: 3 },
  { name: "Epee en fer", category: ItemCategory.Arme, value: 5 },
  { name: "Hache de guerre", category: ItemCategory.Arme, value: 8 },
  { name: "Lame enchantee", category: ItemCategory.Arme, value: 12 },
];

export function getRandomPotion(): Item {
  const index = Math.floor(Math.random() * POTIONS.length);
  return POTIONS[index];
}

export function getRandomWeapon(): Item {
  const index = Math.floor(Math.random() * WEAPONS.length);
  return WEAPONS[index];
}
