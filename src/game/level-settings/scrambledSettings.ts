import { LevelSettings } from "../level-creation/generateRandomLevel";

import { getSettings as getNormalSettings } from "./normalSettings";

export const getSettings = (difficulty: number): LevelSettings => ({
  ...getNormalSettings(difficulty),
  playMoves: [7, 0.3],
});
