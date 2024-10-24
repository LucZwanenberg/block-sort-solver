import { Move } from "../types/Move";
import { QueriedLevelState } from "./query/queryLevelState";

export const makeMove = (
  state: QueriedLevelState,
  move: Move
): QueriedLevelState => {
  const { columns } = state;
  const source = columns[move.source];
  const target = columns[move.target];

  const stack = source.playableTopStack;
  if (stack.empty) return state;

  const size = target.mayPlaceStack(stack);
  if (size === 0) return state;

  return {
    ...state,
    columns: {
      ...columns,
      [move.source]: source.forceRemove(size),
      [move.target]: target.forcePlaceStack({
        ...stack,
        size,
      }),
    },
  };
};
