import { describe, expect, it } from "vitest";
import { extendTree } from "./extendTree";
import { createTree } from "../builder/createTree";

describe("extendTree", () => {
  it("extends tree", () => {
    const root = createTree("1");
    const getNeighbours = (value: string): [string, string][] => [
      ["a", `${value}.1`],
      ["b", `${value}.2`],
    ];

    extendTree({
      getNeighbours,
      node: root,
      depth: 2,
    });

    expect(root.children).toHaveLength(2);
    expect(root.children[0].value).toEqual("1.1");
    expect(root.children[0].parent).toEqual(["a", root]);
    expect(root.children[0].children[0].value).toEqual("1.1.1");
    expect(root.children[0].children[1].value).toEqual("1.1.2");
    expect(root.children[1].value).toEqual("1.2");
    expect(root.children[1].parent).toEqual(["b", root]);
  });
});
