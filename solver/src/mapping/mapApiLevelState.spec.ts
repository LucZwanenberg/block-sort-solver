import { describe, expect, it } from "vitest";
import { createApiLevelState } from "../test-utils/factories/createApiLevelState";
import { createApiBlock } from "../test-utils/factories/createApiBlock";
import { createApiColumn } from "../test-utils/factories/createApiColumn";
import mapApiLevelState from "./mapApiLevelState";

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
          type: "placement",
          slots: ["white", "black", null, null],
        },
        {
          type: "buffer",
          limitColor: "black",
          slots: ["black", "black"],
        },
      ],
    };

    expect(result).toEqual(expected);
  });
});
