import { describe, expect, it } from "vitest";
import { getValidMoves } from "./getValidMoves";
import { Move } from "../types/Move";
import { ColumnType } from "../types/ColumnType";
import { Column } from "../types/Column";
import { createLevelStateLazy as state } from "../../test-utils/factories/domain/createLevelStateLazy";

const PLCMNT = ColumnType.Placement;
const BUFFER = ColumnType.Buffer;

const limit = (color: string): Partial<Column> => ({
  limitColor: color,
});

const analyze = (moves: Move[]) => ({
  source: (index: number) => ({
    targets: moves.filter((m) => m.source === index).map((m) => m.target),
  }),
});

describe("getValidMoves", () => {
  describe("when level state has no columns", () => {
    it("returns empty array", () => {
      const levelState = state([]);

      const validMoves = getValidMoves(levelState);

      expect(validMoves).toEqual([]);
    });
  });

  describe("when level state has only columns without slots", () => {
    it("returns empty array", () => {
      const levelState = state([[[]], [[]]]);

      const validMoves = getValidMoves(levelState);

      expect(validMoves).toEqual([]);
    });
  });

  describe("when source is full with a single color", () => {
    describe("and source color is of type placement", () => {
      it("is locked and cannot move to any target", () => {
        const levelState = state([
          /*    0 */ [PLCMNT, "🟦🟥🟥⬜"],
          /*    1 */ [PLCMNT, "⬜⬜⬜⬜"],
          /* -> 2 */ [PLCMNT, "🟥🟥🟥🟥"],
          /*    3 */ [BUFFER, "⬜⬜⬜⬜"],
        ]);

        const validMoves = getValidMoves(levelState);
        const source = analyze(validMoves).source;

        expect(source(2).targets).toEqual([]);
      });
    });

    describe("and source color is of type buffer", () => {
      it("can move to valid targets", () => {
        const levelState = state([
          /*     0 */ [PLCMNT, "🟦🟥🟥⬜"],
          /*     1 */ [PLCMNT, "⬜⬜⬜⬜"],
          /*  -> 2 */ [BUFFER, "🟥🟥🟥🟥"],
          /*     3 */ [BUFFER, "⬜⬜⬜⬜"],
        ]);

        const validMoves = getValidMoves(levelState);
        const source = analyze(validMoves).source;

        expect(source(2).targets).toEqual([0, 1, 3]);
      });
    });
  });

  describe("when source is empty", () => {
    describe.each<ColumnType>([ColumnType.Placement, ColumnType.Buffer])(
      "and type is %s",
      (_TYPE_) => {
        it("cannot move to any other column", () => {
          const levelState = state([
            /*    0 */ [PLCMNT, "⬜⬜⬜⬜"],
            /*    1 */ [PLCMNT, "🟦🟥⬜⬜"],
            /* -> 2 */ [_TYPE_, "⬜⬜⬜⬜"],
            /*    3 */ [BUFFER, "⬜⬜⬜⬜"],
          ]);

          const validMoves = getValidMoves(levelState);
          const source = analyze(validMoves).source;

          expect(source(2).targets).toEqual([]);
        });
      }
    );
  });

  describe("when target is full", () => {
    it("cannot move to target column", () => {
      const levelState = state([
        /* ->️ 0 */ [PLCMNT, "🟦🟥⬜⬜⬛⬛"],
        /*    1 */ [BUFFER, "🟥🟥🟥🟥🟥🟥"],
        /*    2 */ [PLCMNT, "🟥🟥⬛⬛⬛⬛"],
      ]);

      const validMoves = getValidMoves(levelState);
      const source = analyze(validMoves).source;

      expect(source(0).targets).toEqual([]);
    });
  });

  describe("when target has color limit", () => {
    describe("and color limit is different from source color", () => {
      it("cannot move to target column", () => {
        const levelState = state([
          /* ->️ 0 */ [PLCMNT, "🟦🟥⬜⬜"],
          /*    1 */ [BUFFER, "⬜⬜⬜⬜", limit("🟦")],
          /*    2 */ [PLCMNT, "⬜⬜⬜⬜", limit("🟦")],
        ]);

        const validMoves = getValidMoves(levelState);
        const source = analyze(validMoves).source;

        expect(source(0).targets).toEqual([]);
      });
    });

    describe("and color limit is the same as source color", () => {
      it("can move to target column", () => {
        const levelState = state([
          /* ->️ 0 */ [PLCMNT, "🟦🟥⬜⬜"],
          /*    1 */ [BUFFER, "⬜⬜⬜⬜", limit("🟥")],
          /*    2 */ [PLCMNT, "⬜⬜⬜⬜", limit("🟥")],
        ]);

        const validMoves = getValidMoves(levelState);
        const source = analyze(validMoves).source;

        expect(source(0).targets).toEqual([1, 2]);
      });
    });
  });
});
