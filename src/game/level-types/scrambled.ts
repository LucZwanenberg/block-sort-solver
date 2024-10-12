import { getDifficultyLevel } from "../level-settings/levelSettings";
import { SettingsProducer } from "../types";

import { getNormalSettings } from "./normal";
import { LevelType } from "./types";

export const getScrambledSettings: SettingsProducer = (difficulty) => ({
  ...getNormalSettings(difficulty),
  playMoves: [7, 0.3],
});

export const scrambled: LevelType<"scrambled"> = {
  type: "scrambled",
  name: "Scrambled",
  symbol: "️🧩",
  color: "#94a3b8",
  borderClassName: "border-2 border-slate-400",
  textClassName: "text-slate-400",
  buttonBackgroundClassName: "bg-slate-400",
  unlocksAtLevel: 200,
  occurrence: (levelNr) => levelNr > 180 && levelNr % 9 === 0,
  getSettings: (levelNr) => {
    const difficulty = getDifficultyLevel(levelNr);
    return getScrambledSettings(difficulty);
  },
  getZenSettings: (_levelNr, difficulty) => {
    return getScrambledSettings(difficulty);
  },
};
