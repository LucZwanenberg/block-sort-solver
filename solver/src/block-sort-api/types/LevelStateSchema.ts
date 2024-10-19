import { z } from "zod";

const MoveSchema = z.object({
  tactic: z.string().optional(),
  from: z.number(),
  to: z.number(),
});

const BlockSchema = z.object({
  color: z.string(),
  revealed: z.boolean().optional(),
});

const ColumnSchema = z.object({
  type: z.enum(["placement", "buffer"]),
  locked: z.boolean(),
  limitColor: z.string().optional(),
  columnSize: z.number(),
  blocks: z.array(BlockSchema),
});

export const LevelStateSchema = z.object({
  colors: z.array(z.string()),
  columns: z.array(ColumnSchema),
  moves: z.array(MoveSchema),
  generationInformation: z
    .object({
      cost: z.number().optional(),
      attempts: z.number().optional(),
      seed: z.number().optional(),
    })
    .optional(),
});

export type ApiMove = z.infer<typeof MoveSchema>;
export type ApiBlock = z.infer<typeof BlockSchema>;
export type ApiColumn = z.infer<typeof ColumnSchema>;
export type ApiLevelState = z.infer<typeof LevelStateSchema>;