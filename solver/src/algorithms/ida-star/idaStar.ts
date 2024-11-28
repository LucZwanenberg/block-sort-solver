import { PriorityQueue } from "../priority-queue/PriorityQueue";
import { addChild } from "../tree/builder/addChild";
import { createTree } from "../tree/builder/createTree";
import { TreeNode } from "../tree/types/TreeNode";

type Heuristic<State> = (state: State) => number;
type GetActions<State, Action> = (state: State) => Action[];
type ApplyAction<State, Action> = (state: State, Action: Action) => State;
type GetCanonicalId<State> = (state: State) => string;
type IdaData<State> = {
  state: State;
  score: number;
  actionsCalculated: boolean;
};
type IdaNode<State, Action> = TreeNode<IdaData<State>, Action>;
type NodeVisitHandler<State> = (data: IdaData<State>) => { prune: boolean };
type NodeCreatedHandler<State, Action> = (node: IdaNode<State, Action>) => void;

const createIdaData = <State>(
  state: State,
  heuristic: Heuristic<State>
): IdaData<State> => ({
  state,
  score: heuristic(state),
  actionsCalculated: false,
});

const createCalculateActions =
  <State, Action>(
    getActions: GetActions<State, Action>,
    applyAction: ApplyAction<State, Action>,
    heuristic: Heuristic<State>,
    onStateVisit: NodeVisitHandler<State>,
    onNodeCreated: NodeCreatedHandler<State, Action>
  ) =>
  (node: IdaNode<State, Action>) => {
    if (!node.value.actionsCalculated)
      getActions(node.value.state).forEach((action) => {
        const state = applyAction(node.value.state, action);
        const data = createIdaData(state, heuristic);
        const result = onStateVisit(data);

        if (result.prune) return;

        const child = addChild(node, [action, data]);
        onNodeCreated(child);

        return child;
      });

    node.value.actionsCalculated = true;
    return node.children;
  };

const createDeepen = <State, Action>(
  getActions: GetActions<State, Action>,
  applyAction: ApplyAction<State, Action>,
  heuristic: Heuristic<State>,
  onStateVisit: NodeVisitHandler<State>,
  onNodeCreate: NodeCreatedHandler<State, Action>
) => {
  const calculateActions = createCalculateActions(
    getActions,
    applyAction,
    heuristic,
    onStateVisit,
    onNodeCreate
  );

  const deepen = (node: IdaNode<State, Action>, depth: number) => {
    if (depth <= 0) return;

    const children = calculateActions(node);

    if (depth > 1) children.forEach((child) => deepen(child, depth - 1));
  };

  return deepen;
};

/**
 * Prevent visiting the same canonical state more than once through pruning
 */
const createNodeVisitHandler = <State>(
  getCanonicalId: GetCanonicalId<State>
): NodeVisitHandler<State> => {
  const visitedIds = new Set<string>();

  return (node: IdaData<State>) => {
    const canonicalId = getCanonicalId(node.state);
    if (visitedIds.has(canonicalId)) return { prune: true };

    visitedIds.add(canonicalId);

    return { prune: false };
  };
};

/**
 * Iterative deepening A* (IDA*)
 */
export const idaStar = <State, Action>(
  initialState: State,
  heuristic: Heuristic<State>,
  getActions: GetActions<State, Action>,
  applyAction: ApplyAction<State, Action>,
  getCanonicalId: GetCanonicalId<State>,
  depth: number
) => {
  const priorityQueue = new PriorityQueue<IdaNode<State, Action>>();

  const handleNodeVisit = createNodeVisitHandler(getCanonicalId);
  const handleNodeCreated: NodeCreatedHandler<State, Action> = (node) => {
    // TODO: check for win, score = Number.MAX_SAFE_INTEGER
    return priorityQueue.enqueue(node, node.value.score);
  };

  const deepen = createDeepen(
    getActions,
    applyAction,
    heuristic,
    handleNodeVisit,
    handleNodeCreated
  );

  const root = createIdaData(initialState, heuristic);
  const tree = createTree<IdaData<State>, Action>(root);

  handleNodeVisit(root);

  while (!priorityQueue.isEmpty()) {
    const next = priorityQueue.dequeue();

    // TODO: check for loss, score = Number.MIN_SAFE_INTEGER

    deepen(next, depth);
  }

  const actions = getActions(tree.value.state);
};
