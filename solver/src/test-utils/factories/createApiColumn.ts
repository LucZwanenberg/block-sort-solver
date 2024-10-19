import { ApiColumn } from "../../block-sort-api/types/LevelStateSchema";
import { createFactory } from "./createFactory";
import { createApiBlock } from "./createApiBlock";

export const createApiColumn = createFactory<ApiColumn>({
  type: "placement",
  locked: false,
  columnSize: 6,
  blocks: [
    createApiBlock({ color: "black" }),
    createApiBlock({ color: "white" }),
    createApiBlock({ color: "black" }),
    createApiBlock({ color: "white" }),
  ],
});
