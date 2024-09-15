import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { createBlock, createPlacementColumn } from "../factories";

import { generatePlayableLevel } from "./tactics";

const TEST_SEED = 123456789;

describe(generatePlayableLevel, () => {
  it("generates a simple level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = generatePlayableLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 2,
      },
      random
    );
    expect(level.colors).toEqual(["black", "green"]);
    expect(level.columns).toEqual([
      createPlacementColumn(4, [
        createBlock("green"),
        createBlock("black"),
        createBlock("green"),
        createBlock("green"),
      ]),
      createPlacementColumn(4, [
        createBlock("black"),
        createBlock("black"),
        createBlock("green"),
        createBlock("black"),
      ]),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);
    expect(level.moves).toHaveLength(5);
  });

  it("generates a medium level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = generatePlayableLevel(
      {
        amountColors: 5,
        stackSize: 4,
        extraPlacementStacks: 2,
      },
      random
    );
    expect(level.colors).toHaveLength(5);
    expect(level.moves).toHaveLength(16);
  });

  it("generates a complex level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = generatePlayableLevel(
      {
        amountColors: 9,
        stackSize: 4,
        extraPlacementStacks: 2,
      },
      random
    );
    expect(level.colors).toHaveLength(9);
    expect(level.moves).toHaveLength(25);
  });

  it("has around 30 of moves on average", () => {
    const random = mulberry32(TEST_SEED);
    const results = timesMap(
      10,
      () =>
        generatePlayableLevel(
          {
            amountColors: 9,
            stackSize: 4,
            extraPlacementStacks: 2,
          },
          random
        ).moves.length
    );
    const average = results.reduce((r, i) => r + i, 0) / results.length;
    expect(average).toBeCloseTo(30.2, 3);
  });

  it("generates a hard level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = generatePlayableLevel(
      {
        amountColors: 9,
        stackSize: 4,
        extraPlacementStacks: 2,
        minimalAmountOfMoves: 35,
      },
      random
    );
    expect(level.colors).toHaveLength(9);
    expect(level.moves).toHaveLength(37);
  });

  it("generates a easy level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = generatePlayableLevel(
      {
        amountColors: 9,
        stackSize: 4,
        extraPlacementStacks: 2,
        maximalAmountOfMoves: 25,
      },
      random
    );
    expect(level.colors).toHaveLength(9);
    expect(level.moves).toHaveLength(25);
  });

  it("generates a complex level (buffers / force)", async () => {
    const random = mulberry32(TEST_SEED);
    const level = generatePlayableLevel(
      {
        amountColors: 4,
        stackSize: 16,
        extraPlacementStacks: 1,
        extraPlacementLimits: 1,
        buffers: 3,
        bufferSizes: 4,
      },
      random
    );
    expect(level.colors).toHaveLength(4);
    expect(level.moves).toHaveLength(88);
  });

  it("throws an error if it can't generate a playable level", () => {
    const random = mulberry32(TEST_SEED);
    expect(() =>
      generatePlayableLevel(
        {
          amountColors: 1,
          extraPlacementStacks: 0,
        },
        random
      )
    ).toThrow("Can't generate playable level");
  });
});
