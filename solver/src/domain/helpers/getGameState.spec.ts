import { describe, expect, it } from "vitest";
import { queryLevelState } from "./query/queryLevelState";
import { createLevelStateLazy } from "../../test-utils/factories/domain/createLevelStateLazy";
import { ColumnType } from "../types/ColumnType";
import { getGameState } from "./getGameState";
import { GameState } from "../types/GameState";

const PLCMNT = ColumnType.Placement;
const BUFFER = ColumnType.Buffer;

const queryState = (...args: Parameters<typeof createLevelStateLazy>) =>
  queryLevelState(createLevelStateLazy(...args));

describe("getGameState", () => {
  describe("when all columns are sorted", () => {
    it("returns won", () => {
      const levelState = queryState([
        [PLCMNT, "🟦🟦🟦🟦"],
        [PLCMNT, "🟥🟥🟥🟥"],
        [PLCMNT, "🟩🟩🟩🟩"],
        [PLCMNT, "⬜⬜⬜⬜"],
        [BUFFER, "⬜⬜⬜⬜"],
      ]);

      const state = getGameState(levelState);

      expect(state).toEqual(GameState.Won);
    });
  });

  describe("when columns are not sorted", () => {
    it("returns ongoing", () => {
      const levelState = queryState([
        [PLCMNT, "🟦🟦🟦🟥"],
        [PLCMNT, "🟥🟥🟩🟩"],
        [PLCMNT, "🟦🟥🟩⬜"],
        [PLCMNT, "🟦🟩🟩⬜"],
      ]);

      const state = getGameState(levelState);

      expect(state).toEqual(GameState.Ongoing);
    });
  });

  describe("when stuck", () => {
    it("returns lost", () => {
      const levelState = queryState([
        [PLCMNT, "🟦🟦🟦🟥"],
        [PLCMNT, "🟥🟥🟩🟩"],
        [PLCMNT, "🟦🟥🟩⬜"],
        [PLCMNT, "🟩🟩🟦⬜"],
      ]);

      const state = getGameState(levelState);

      expect(state).toEqual(GameState.Lost);
    });
  });
});
