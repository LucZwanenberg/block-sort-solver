import { ApiBlock } from "../../block-sort-api/types/LevelStateSchema";
import { createFactory } from "./createFactory";

export const createApiBlock = createFactory<ApiBlock>({
  color: "black",
});
