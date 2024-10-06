import { LevelSettings } from "../level-creation/generateRandomLevel";

export const getNormalSettings = (difficulty: number): LevelSettings => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(2 + Math.floor(difficulty / 2), 4), 7),
  extraPlacementStacks: difficulty < 2 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: "none",
});

export const getNormal2Settings = (difficulty: number): LevelSettings => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(difficulty - 3, 4), 7),
  extraPlacementStacks: difficulty < 2 || difficulty > 9 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: "none",
  buffers: difficulty > 9 ? 2 : undefined,
  bufferSizes: difficulty === 10 ? 3 : difficulty === 11 ? 2 : undefined,
});

export const getNormal3Settings = (difficulty: number): LevelSettings => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(difficulty - 3, 4), 7),
  extraPlacementStacks: difficulty < 2 || difficulty > 9 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: "none",
  buffers: difficulty > 9 ? 2 : undefined,
  bufferSizes: difficulty === 10 ? 2 : difficulty === 11 ? 2 : undefined,
  extraBuffers:
    difficulty === 10 ? [{ size: 1, amount: 1, limit: 0 }] : undefined,
});
