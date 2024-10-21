import { Color } from "./Color";

export const emptyStack: EmptyStack = {
  empty: true,
  size: 0,
};

export const createStack = (color: Color, size: number): NonEmptyStack => ({
  empty: false,
  size,
  color,
});

export type EmptyStack = {
  empty: true;
  size: 0;
};

export type NonEmptyStack = {
  empty: false;
  color: Color;
  size: number;
};

export type Stack = EmptyStack | NonEmptyStack;
