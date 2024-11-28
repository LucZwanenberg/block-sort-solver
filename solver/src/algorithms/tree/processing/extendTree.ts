import { addChild } from "../builder/addChild";
import { TreeNode } from "../types/TreeNode";

export const extendTree = <Value, Edge>({
  getNeighbours,
  node,
  depth,
}: {
  getNeighbours: (value: Value) => [Edge, Value][];
  node: TreeNode<Value, Edge>;
  depth: number;
}) => {
  const children = getNeighbours(node.value);

  children.forEach((child) => {
    const childNode = addChild(node, child);
    if (depth > 1)
      extendTree({ getNeighbours, node: childNode, depth: depth - 1 });
  });

  return node;
};
