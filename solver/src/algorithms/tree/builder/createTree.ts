import { TreeNode } from "../types/TreeNode";

export const createTree = <Value, Edge>(
  rootValue: Value
): TreeNode<Value, Edge> => ({
  value: rootValue,
  parent: null,
  children: [],
});
