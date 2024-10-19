import {
  ApiColumn,
  ApiLevelState,
} from "../block-sort-api/types/LevelStateSchema";

const mapSlots = (column: ApiColumn): ColumnSlot[] => [
  ...column.blocks.map((block) => block.color),
  ...Array(column.columnSize - column.blocks.length).fill(null),
];

const mapColumn = (column: ApiColumn): Column => ({
  type: column.type,
  slots: mapSlots(column),
});

const mapApiLevelState = (apiLevelState: ApiLevelState): LevelState => ({
  columns: apiLevelState.columns.map(mapColumn),
});

export default mapApiLevelState;
