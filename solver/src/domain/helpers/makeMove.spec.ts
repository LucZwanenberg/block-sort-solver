import { describe, expect, it } from "vitest";
import { createLevelStateLazy } from "../../test-utils/factories/domain/createLevelStateLazy";
import { queryLevelState } from "./query/queryLevelState";
import { makeMove } from "./makeMove";

const queryState = (...args: Parameters<typeof createLevelStateLazy>) =>
  queryLevelState(createLevelStateLazy(...args));

describe("makeMove", () => {
  it("moves stacks between columns", () => {
    const levelState = queryState([
      /*    0 */ ["🟦🟥🟥⬜"],
      /*    1 */ ["⬜⬜⬜⬜"],
      /* -> 2 */ ["🟥🟥🟥⬜"],
    ]);

    const { columns } = makeMove(levelState, {
      source: 2,
      target: 0,
    });

    expect(columns[0].slots).toEqual(["🟦", "🟥", "🟥", "🟥"]);
    expect(columns[2].slots).toEqual(["🟥", "🟥", null, null]);
  });
});
