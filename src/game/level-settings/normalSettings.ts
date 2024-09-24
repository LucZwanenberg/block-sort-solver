import { LevelSettings } from "../level-creation/generateRandomLevel";

export const getSettings = (difficulty: number): LevelSettings => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(difficulty - 3, 4), 7),
  extraPlacementStacks: difficulty < 2 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: false,
});
