import { Color } from "../types/Color";
import { Column } from "../types/Column";
import { LevelState } from "../types/LevelState";
import { Move } from "../types/Move";

type AllowedColors =
  | { type: "none" }
  | { type: "all" }
  | { type: "specific"; color: Color };

const getTopColor = (column: Column): string | null =>
  column.slots.filter((slot) => slot !== null).pop() ?? null;

const columnIsFull = (column: Column): boolean =>
  column.slots.findIndex((slot) => slot === null) === -1;

const getAllowedColorsForColumn = (column: Column): AllowedColors => {
  if (columnIsFull(column)) return { type: "none" };
  if (column.limitColor) return { type: "specific", color: column.limitColor };

  return { type: "all" };
};

const isColorAllowed = (color: string, allowedColors: AllowedColors) =>
  allowedColors.type === "all" ||
  (allowedColors.type === "specific" && color === allowedColors.color);

const isLocked = (column: Column) =>
  column.type === "placement" && columnIsFull(column);

export const getValidMoves = ({ columns }: LevelState): Move[] => {
  const allowedColors = columns.map(getAllowedColorsForColumn);

  const moves: Move[] = [];

  for (let source = 0; source < columns.length; source++) {
    if (isLocked(columns[source])) continue;

    const topColor = getTopColor(columns[source]);

    if (topColor === null) continue;

    for (let target = 0; target < columns.length; target++) {
      if (source === target) continue;
      if (isColorAllowed(topColor, allowedColors[target])) {
        moves.push({
          source: source,
          target: target,
        });
      }
    }
  }

  return moves;
};
