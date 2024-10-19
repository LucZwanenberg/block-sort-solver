import { ApiLevelState } from "../../block-sort-api/types/LevelStateSchema";
import { createFactory } from "./createFactory";

export const createApiLevelState = createFactory<ApiLevelState>({
  colors: ["white", "black"],
  columns: [], // TODO
  moves: [],
});
