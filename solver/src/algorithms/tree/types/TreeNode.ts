export type TreeNode<Value, Edge> = {
  value: Value;
  parent: [Edge, TreeNode<Value, Edge>] | null;
  children: TreeNode<Value, Edge>[];
};
