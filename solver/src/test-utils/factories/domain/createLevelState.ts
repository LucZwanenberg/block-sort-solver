import { ColumnType } from "../../../domain/types/ColumnType";
import { LevelState } from "../../../domain/types/LevelState";
import { createFactory } from "../createFactory";
import { createColumn } from "./createColumn";

export const createLevelState = createFactory<LevelState>({
  columns: [
    createColumn({
      type: ColumnType.Placement,
      slots: ["black", "white", "white", null, null],
    }),
    createColumn({
      type: ColumnType.Placement,
      slots: ["black", "black"],
    }),
    createColumn({
      type: ColumnType.Buffer,
      slots: ["white", "white"],
    }),
  ],
});
