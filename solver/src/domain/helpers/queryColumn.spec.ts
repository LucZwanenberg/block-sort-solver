import { describe, expect, it } from "vitest";
import { queryColumn } from "./queryColumn";
import { createColumnLazy as createColumn } from "../../test-utils/factories/domain/createColumnLazy";
import { ColumnType } from "../types/ColumnType";
import { Column } from "../types/Column";
import { createStack, Stack } from "../types/Stack";

const PLCMNT = ColumnType.Placement;
const BUFFER = ColumnType.Buffer;

const limit = (color: string): Partial<Column> => ({
  limitColor: color,
});

describe("queryColumn", () => {
  describe("#index", () => {
    it("is equal to given index", () => {
      const column = createColumn();
      const index = 42;

      const result = queryColumn(column, index);

      expect(result.index).toEqual(42);
    });
  });

  describe("#playableTopStack", () => {
    describe("when column has no slots", () => {
      it("returns empty stack", () => {
        const column = createColumn([]);

        const { playableTopStack } = queryColumn(column, 42);

        expect(playableTopStack.empty).toEqual(true);
      });
    });

    describe("when column has only empty slots", () => {
      it("returns empty stack", () => {
        const column = createColumn([null, null, null, null]);

        const { playableTopStack } = queryColumn(column, 42);

        expect(playableTopStack.empty).toEqual(true);
      });
    });

    describe("when column is partially full", () => {
      it("returns top stack", () => {
        const column = createColumn(BUFFER, ["🟥", "🟦", "🟥", "🟥", null]);

        const { playableTopStack } = queryColumn(column, 42);

        expect(playableTopStack).toEqual({
          color: "🟥",
          empty: false,
          size: 2,
        });
      });
    });

    describe("when column is full with single color", () => {
      describe("when column type is buffer", () => {
        it("returns full stack", () => {
          const column = createColumn(BUFFER, ["🟥", "🟥", "🟥", "🟥"]);

          const { playableTopStack } = queryColumn(column, 42);

          expect(playableTopStack).toEqual({
            color: "🟥",
            empty: false,
            size: 4,
          });
        });
      });

      describe("when column type is placement", () => {
        it("is locked and returns empty stack", () => {
          const column = createColumn(PLCMNT, ["🟥", "🟥", "🟥", "🟥"]);

          const { playableTopStack } = queryColumn(column, 42);

          expect(playableTopStack.empty).toEqual(true);
        });
      });
    });
    describe("when column is full with mixed colors", () => {
      it("returns top stack", () => {
        const column = createColumn(BUFFER, ["🟥", "🟦", "🟥", "🟥", "🟥"]);

        const { playableTopStack } = queryColumn(column, 42);

        expect(playableTopStack).toEqual({
          color: "🟥",
          empty: false,
          size: 3,
        });
      });
    });
  });

  describe("#mayPlaceStack", () => {
    describe("when target is full", () => {
      it("returns 0", () => {
        const column = createColumn(BUFFER, ["🟥", "🟦", "🟥", "🟥", "🟥"]);
        const stackToPlace = createStack("🟥", 1);

        const { mayPlaceStack } = queryColumn(column, 42);

        expect(mayPlaceStack(stackToPlace)).toEqual(0);
      });
    });

    describe("when target has different top color", () => {
      it("returns 0", () => {
        const column = createColumn(BUFFER, ["🟥", "🟦", "🟥", null, null]);
        const stackToPlace = createStack("🟦", 1);

        const { mayPlaceStack } = queryColumn(column, 42);

        expect(mayPlaceStack(stackToPlace)).toEqual(0);
      });
    });

    describe("when target has same top color", () => {
      describe("when stack has smaller size than empty slots", () => {
        it("returns stack size", () => {
          const column = createColumn(BUFFER, ["🟥", "🟦", "🟥", null, null]);
          const stackToPlace = createStack("🟥", 1);

          const { mayPlaceStack } = queryColumn(column, 42);

          expect(mayPlaceStack(stackToPlace)).toEqual(1);
        });
      });

      describe("when stack has same size as empty slots", () => {
        it("returns stack size", () => {
          const column = createColumn(BUFFER, ["🟥", "🟦", "🟥", null, null]);
          const stackToPlace = createStack("🟥", 2);

          const { mayPlaceStack } = queryColumn(column, 42);

          expect(mayPlaceStack(stackToPlace)).toEqual(2);
        });
      });

      describe("when stack has greater size than empty slots", () => {
        it("returns amount of empty slots", () => {
          const column = createColumn(BUFFER, ["🟥", "🟦", "🟥", null, null]);
          const stackToPlace = createStack("🟥", 3);

          const { mayPlaceStack } = queryColumn(column, 42);

          expect(mayPlaceStack(stackToPlace)).toEqual(2);
        });
      });
    });

    describe("when target has color limit", () => {
      describe("when color limit different from stack color", () => {
        it("returns 0", () => {
          const column = createColumn([null, null, null], limit("🟦"));
          const stackToPlace = createStack("🟥", 3);

          const { mayPlaceStack } = queryColumn(column, 42);

          expect(mayPlaceStack(stackToPlace)).toEqual(0);
        });
      });

      describe("when color limit is equal to stack color", () => {
        it("returns allowed blocks to place", () => {
          const column = createColumn([null, null, null], limit("🟥"));
          const stackToPlace = createStack("🟥", 3);

          const { mayPlaceStack } = queryColumn(column, 42);

          expect(mayPlaceStack(stackToPlace)).toEqual(3);
        });
      });
    });
  });
});