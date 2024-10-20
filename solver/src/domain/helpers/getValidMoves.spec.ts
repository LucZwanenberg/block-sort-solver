import { describe, expect, it } from "vitest";
import { createLevelState } from "../../test-utils/factories/domain/createLevelState";
import { getValidMoves } from "./getValidMoves";
import { createColumn } from "../../test-utils/factories/domain/createColumn";
import { Move } from "../types/Move";
import { ColumnType } from "../types/ColumnType";
import { Column } from "../types/Column";
import { ColumnSlot } from "../types/ColumnSlot";

const slots = {
  none: { slots: [] },
  empty: { slots: [null, null, null] },
  with: (...colors: (string | null)[]) => ({ slots: colors }),
  full: {
    with: (colors: string | string[]) => ({
      slots: colors instanceof Array ? colors : [colors, colors, colors],
    }),
  },
  partial: {
    with: (...colors: string[]) => ({ slots: [...colors, null, null] }),
  },
};

const PLCMNT = ColumnType.Placement;
const BUFFER = ColumnType.Buffer;

const limit = (color: string): Partial<Column> => ({
  limitColor: color,
});

type ColumnData = ColumnSlot[] | string | ColumnType | Partial<Column>;

const columnDataToPartial = (data: ColumnData): Partial<Column> => {
  if (data === ColumnType.Buffer) return { type: ColumnType.Buffer };
  if (data === ColumnType.Placement) return { type: ColumnType.Placement };

  if (data instanceof Array)
    return { slots: data.map((value) => (value === "⬜" ? null : value)) };

  if (typeof data === "string")
    return {
      slots: Array.from(data)
        .filter((value) => value !== "⬛")
        .map((value) => (value === "⬜" ? null : value)),
    };

  return data;
};

const col = (...overrideParts: ColumnData[]): Column =>
  createColumn(
    overrideParts.reduce<Partial<Column>>(
      (partial, columnData) => ({
        ...partial,
        ...columnDataToPartial(columnData),
      }),
      {}
    )
  );

const cols = (...overrideParts: ColumnData[][]): Column[] =>
  overrideParts.map((parts) => col(...parts));

type Cols = Parameters<typeof cols>;

const state = (columns: Cols) =>
  createLevelState({
    columns: cols(...columns),
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
      it.only("can move to target column", () => {
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
