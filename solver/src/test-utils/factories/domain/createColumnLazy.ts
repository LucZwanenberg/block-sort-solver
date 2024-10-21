import { Column } from "../../../domain/types/Column";
import { ColumnSlot } from "../../../domain/types/ColumnSlot";
import { ColumnType } from "../../../domain/types/ColumnType";
import { createColumn } from "./createColumn";

export type ColumnData = ColumnSlot[] | string | ColumnType | Partial<Column>;

const columnDataToPartial = (data: ColumnData): Partial<Column> => {
  if (data === ColumnType.Buffer) return { type: ColumnType.Buffer };
  if (data === ColumnType.Placement) return { type: ColumnType.Placement };

  if (data instanceof Array)
    return { slots: data.map((value) => (value === "⬜" ? null : value)) };

  if (typeof data === "string")
    return {
      slots: Array.from(data)
        .filter((value) => value !== "⬛")
        .map((value) => (value === "⬜" ? null : value)),
    };

  return data;
};

export const createColumnLazy = (...overrideParts: ColumnData[]): Column =>
  createColumn(
    overrideParts.reduce<Partial<Column>>(
      (partial, columnData) => ({
        ...partial,
        ...columnDataToPartial(columnData),
      }),
      {}
    )
  );
