import { Column } from "../../../domain/types/Column";
import { ColumnType } from "../../../domain/types/ColumnType";
import { createFactory } from "../createFactory";

export const createColumn = createFactory<Column>({
  type: ColumnType.Placement,
  slots: ["black", "white", "white", null, null],
});
