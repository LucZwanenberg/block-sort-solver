import { describe, expect, it } from "vitest";
import { createTree } from "./createTree";
import { addChild } from "./addChild";

describe("addChild", () => {
  it("correctly links child node to parent", () => {
    const root = createTree({ myAttr: "root" });

    const child1 = addChild(root, [{ edge: "r->c1" }, { myAttr: "child1" }]);
    const child2 = addChild(root, [{ edge: "r->c2" }, { myAttr: "child2" }]);

    expect(root.children).toEqual([child1, child2]);

    expect(child1).toEqual({
      value: { myAttr: "child1" },
      parent: [{ edge: "r->c1" }, root],
      children: [],
    });

    expect(child2).toEqual({
      value: { myAttr: "child2" },
      parent: [{ edge: "r->c2" }, root],
      children: [],
    });
  });
});
