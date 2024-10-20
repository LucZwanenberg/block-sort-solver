import { ColumnType } from "./ColumnType";
import { ColumnSlot } from "./ColumnSlot";

export type Column = {
  type: ColumnType;
  limitColor?: string;
  slots: ColumnSlot[];
};
