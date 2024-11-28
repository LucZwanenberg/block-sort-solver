import {
  ApiColumn,
  ApiLevelState,
} from "../block-sort-api/types/LevelStateSchema";
import { LevelState } from "../domain/types/LevelState";
import { ColumnSlot } from "../domain/types/ColumnSlot";
import { Column } from "../domain/types/Column";
import { ColumnType } from "../domain/types/ColumnType";

const mapSlots = (column: ApiColumn): ColumnSlot[] => [
  ...column.blocks.map((block) => block.color),
  ...Array(column.columnSize - column.blocks.length).fill(null),
];

const mapColumn = (column: ApiColumn, index: number): Column => ({
  type: column.type === "placement" ? ColumnType.Placement : ColumnType.Buffer,
  limitColor: column.limitColor,
  slots: mapSlots(column),
});

const mapApiLevelState = (apiLevelState: ApiLevelState): LevelState => ({
  columns: apiLevelState.columns.map(mapColumn),
});

export default mapApiLevelState;
