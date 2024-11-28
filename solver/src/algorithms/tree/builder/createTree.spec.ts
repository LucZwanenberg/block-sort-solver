import { createTree } from "./createTree";
import { describe, it, expect } from "vitest";

describe("createTree", () => {
  it("creates a root node", () => {
    const value = { hello: "world" };

    const tree = createTree(value);

    expect(tree).toEqual({
      value,
      parent: null,
      children: [],
    });
  });
});
