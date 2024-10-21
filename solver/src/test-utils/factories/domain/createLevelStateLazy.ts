import { createLevelState } from "./createLevelState";
import { Column } from "../../../domain/types/Column";
import { ColumnData, createColumnLazy } from "./createColumnLazy";

const cols = (...overrideParts: ColumnData[][]): Column[] =>
  overrideParts.map((parts) => createColumnLazy(...parts));

/**
 * Create a level state from a provided 2D array representing the columns of
 * the level state.
 */
export const createLevelStateLazy = (columns: Parameters<typeof cols>) =>
  createLevelState({
    columns: cols(...columns),
  });
