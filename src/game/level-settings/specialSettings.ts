import { SettingsProducer } from "../level-creation/generateRandomLevel";

export const getSpecial1Settings: SettingsProducer = (difficulty) => ({
  amountColors: 4,
  stackSize: 12 + Math.max(Math.round(difficulty / 8), 0),
  extraPlacementStacks: 0,
  buffers: 4,
  bufferSizes: 4 - Math.max(Math.round((difficulty - 7) / 4), 0),
  bufferPlacementLimits: 0 + Math.max(Math.round(difficulty / 4), 0),
  extraBuffers: [
    {
      amount: 1,
      size: difficulty > 8 ? 3 : 4,
      limit: 0,
    },
    {
      amount: 1,
      size: difficulty > 10 ? 3 : 4,
      limit: 0,
    },
  ],
  blockColorPick: "end",
});

export const getSpecial2Settings: SettingsProducer = (difficulty) => ({
  amountColors: 10 + Math.min(Math.max(Math.round(difficulty / 2), 0), 6),
  stackSize: 3,
  extraPlacementStacks:
    4 - Math.min(Math.max(Math.round(difficulty / 2), 0), 2),
  extraPlacementLimits: Math.max(
    4 - Math.min(Math.max(Math.round(difficulty / 2), 0), 3) - 1,
    0
  ),
  blockColorPick: "end",
});

export const getSpecial3Settings: SettingsProducer = (difficulty) => ({
  amountColors: 5,
  stackSize: difficulty > 4 ? 5 : 4,
  extraPlacementStacks: 2,
  extraPlacementLimits:
    0 + Math.max(Math.min(Math.round(difficulty / 5), 2), 0),
  blockColorPick: "end",
});

export const getSpecial4Settings: SettingsProducer = (difficulty) => ({
  amountColors: 5 + Math.max(Math.round(difficulty / 8), 0),
  stacksPerColor: 2,
  stackSize: 3,
  extraPlacementStacks: 2,
  extraPlacementLimits: 2,
  buffers: 1,
  bufferSizes: 1,
  blockColorPick: "end",
});

export const getSpecial5Settings: SettingsProducer = (difficulty) => ({
  amountColors: 5,
  stackSize: difficulty > 4 ? 5 : 4,
  extraPlacementStacks: 0,
  extraPlacementLimits: 0,
  buffers: 1,
  bufferSizes: difficulty > 4 ? 5 : 4,
  bufferPlacementLimits: 1,
  extraBuffers: [
    { amount: 1, size: difficulty > 4 && difficulty < 10 ? 4 : 3, limit: 1 },
    { amount: 1, size: difficulty > 4 && difficulty < 8 ? 3 : 2, limit: 1 },
  ],
  blockColorPick: "end",
});
