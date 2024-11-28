import { TreeNode } from "../types/TreeNode";

export const addChild = <Value, Edge>(
  parent: TreeNode<Value, Edge>,
  [edge, value]: [Edge, Value]
) => {
  const node: TreeNode<Value, Edge> = {
    value,
    parent: [edge, parent],
    children: [],
  };

  parent.children.push(node);

  return node;
};
