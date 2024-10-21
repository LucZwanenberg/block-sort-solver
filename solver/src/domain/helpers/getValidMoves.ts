import { LevelState } from "../types/LevelState";
import { Move } from "../types/Move";
import { queryColumn } from "./queryColumn";

export const getValidMoves = (state: LevelState): Move[] => {
  const columns = state.columns.map(queryColumn);

  const moves: Move[] = [];

  for (let s = 0; s < columns.length; s++) {
    const source = columns[s];

    if (source.playableTopStack.empty) continue;

    for (let t = 0; t < columns.length; t++) {
      const target = columns[t];

      if (s === t) continue;
      if (target.mayPlaceStack(source.playableTopStack)) {
        moves.push({
          source: s,
          target: t,
        });
      }
    }
  }

  return moves;
};
