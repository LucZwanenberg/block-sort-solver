type ColumnType = "placement" | "buffer";

type Color = string;

type ColumnSlot = Color | null;

type Column = {
  type: ColumnType;
  slots: ColumnSlot[];
};

type LevelState = {
  columns: Column[];
};
