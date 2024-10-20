import { createColumn } from "./createColumn";
import { createLevelState } from "./createLevelState";
import { Column } from "../../../domain/types/Column";
import { ColumnSlot } from "../../../domain/types/ColumnSlot";
import { ColumnType } from "../../../domain/types/ColumnType";

type ColumnData = ColumnSlot[] | string | ColumnType | Partial<Column>;

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

const col = (...overrideParts: ColumnData[]): Column =>
  createColumn(
    overrideParts.reduce<Partial<Column>>(
      (partial, columnData) => ({
        ...partial,
        ...columnDataToPartial(columnData),
      }),
      {}
    )
  );

const cols = (...overrideParts: ColumnData[][]): Column[] =>
  overrideParts.map((parts) => col(...parts));

export const createLevelStateLazy = (columns: Parameters<typeof cols>) =>
  createLevelState({
    columns: cols(...columns),
  });
