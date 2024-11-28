import { GameState } from "../types/GameState";
import { QueriedColumn } from "./query/queryColumn";
import { QueriedLevelState } from "./query/queryLevelState";

const hasWon = (levelState: QueriedLevelState): boolean =>
  levelState.columns.every((column) => column.playableTopStack.empty);

const cannotFullyMoveStack = (
  columnIndex: number,
  levelState: QueriedLevelState
) => {
  const { playableTopStack } = levelState.columns[columnIndex];

  if (playableTopStack.empty) return true;

  const targetSize = levelState.columns.reduce(
    (size, target, targetIndex) =>
      targetIndex === columnIndex
        ? size
        : size + target.mayPlaceStack(playableTopStack),
    0
  );

  return targetSize < playableTopStack.size;
};

const hasLost = (levelState: QueriedLevelState): boolean =>
  levelState.columns.every((_column, index) =>
    cannotFullyMoveStack(index, levelState)
  );

export const getGameState = (levelState: QueriedLevelState): GameState => {
  if (hasWon(levelState)) return GameState.Won;
  if (hasLost(levelState)) return GameState.Lost;
  return GameState.Ongoing;
};
