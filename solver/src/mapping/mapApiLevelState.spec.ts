import { describe, expect, it } from "vitest";
import { createApiLevelState } from "../test-utils/factories/api/createApiLevelState";
import { createApiBlock } from "../test-utils/factories/api/createApiBlock";
import { createApiColumn } from "../test-utils/factories/api/createApiColumn";
import mapApiLevelState from "./mapApiLevelState";
import { LevelState } from "../domain/types/LevelState";
import { ColumnType } from "../domain/types/ColumnType";

describe("mapApiLevelState", () => {
  it("runs tests", () => {
    const apiLevelState = createApiLevelState({
      columns: [
        createApiColumn({
          type: "placement",
          columnSize: 4,
          blocks: [
            createApiBlock({ color: "white" }),
            createApiBlock({ color: "black" }),
          ],
        }),
        createApiColumn({
          type: "buffer",
          columnSize: 2,
          limitColor: "black",
          blocks: [
            createApiBlock({ color: "black" }),
            createApiBlock({ color: "black" }),
          ],
        }),
      ],
    });

    const result = mapApiLevelState(apiLevelState);

    const expected: LevelState = {
      columns: [
        {
          type: ColumnType.Placement,
          slots: ["white", "black", null, null],
        },
        {
          type: ColumnType.Buffer,
          limitColor: "black",
          slots: ["black", "black"],
        },
      ],
    };

    expect(result).toEqual(expected);
  });
});
