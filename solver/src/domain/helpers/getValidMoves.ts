import { LevelState } from "../types/LevelState";
import { Move } from "../types/Move";
import { queryColumn } from "./queryColumn";

export const getValidMoves = (state: LevelState): Move[] => {
  const columns = state.columns.map(queryColumn);

  const moves: Move[] = [];

  for (let i = 0; i < columns.length; i++) {
    const source = columns[i];

    if (source.playableTopStack.empty) continue;

    for (let j = 0; j < columns.length; j++) {
      const target = columns[j];

      if (source.index === target.index) continue;
      if (target.mayPlaceStack(source.playableTopStack)) {
        moves.push({
          source: source.index,
          target: target.index,
        });
      }
    }
  }

  return moves;
};
