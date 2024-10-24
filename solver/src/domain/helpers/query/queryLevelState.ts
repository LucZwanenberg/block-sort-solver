import { LevelState } from "../../types/LevelState";
import { queryColumn } from "./queryColumn";

export type QueriedLevelState = ReturnType<typeof queryLevelState>;

export const queryLevelState = (levelState: LevelState) => ({
  columns: levelState.columns.map(queryColumn),
});
