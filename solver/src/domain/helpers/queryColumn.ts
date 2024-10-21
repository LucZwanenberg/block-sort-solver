import { Color } from "../types/Color";
import { Column } from "../types/Column";
import { emptyStack, createStack, Stack, NonEmptyStack } from "../types/Stack";

type AllowedColors =
  | { type: "none" }
  | { type: "all" }
  | { type: "specific"; color: Color };

const columnIsFull = (column: Column): boolean =>
  column.slots.length === 0 || column.slots[column.slots.length - 1] !== null;

const isColorAllowed = (color: Color, allowedColors: AllowedColors) =>
  allowedColors.type === "all" ||
  (allowedColors.type === "specific" && color === allowedColors.color);

const getAllowedColorsForColumn = (
  column: Column,
  topStack: Stack
): AllowedColors => {
  if (columnIsFull(column)) return { type: "none" };
  if (column.limitColor) return { type: "specific", color: column.limitColor };
  if (!topStack.empty) return { type: "specific", color: topStack.color };

  return { type: "all" };
};

const getIsLocked = (column: Column, topStack: Stack) =>
  column.type === "placement" && column.slots.length === topStack.size;

const analyzeColumn = ({
  slots,
}: Column): {
  topStack: Stack;
  emptySlots: number;
} => {
  let emptySlots = 0;
  let color: Color | null = null;
  let size: number = 0;

  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i] === null) {
      emptySlots++;
      continue;
    }

    if (color === null) {
      color = slots[i];
      size = 1;
      continue;
    }

    if (slots[i] === color) {
      size++;
      continue;
    }

    break;
  }

  const topStack = color === null ? emptyStack : createStack(color, size);

  return {
    topStack,
    emptySlots,
  };
};

export const queryColumn = (column: Column, index: number) => {
  const { topStack, emptySlots } = analyzeColumn(column);
  const isLocked = getIsLocked(column, topStack);
  const isPlayable = !topStack.empty && !isLocked;
  const playableTopStack: Stack = isPlayable ? topStack : emptyStack;
  const allowedColors = getAllowedColorsForColumn(column, topStack);

  const mayPlaceStack = (stack: NonEmptyStack): number =>
    !emptySlots || !isColorAllowed(stack.color, allowedColors)
      ? 0
      : emptySlots > stack.size
      ? stack.size
      : emptySlots;

  return {
    index,
    playableTopStack,
    mayPlaceStack,
  };
};
