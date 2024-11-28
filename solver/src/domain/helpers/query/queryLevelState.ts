import { LevelState } from "../../types/LevelState";
import { QueriedColumn, queryColumn } from "./queryColumn";

export type QueriedLevelState = {
  columns: QueriedColumn[];
};

export const queryLevelState = (levelState: LevelState): QueriedLevelState => ({
  columns: levelState.columns.map(queryColumn),
});
