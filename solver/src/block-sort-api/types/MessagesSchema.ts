import { z } from "zod";
import { LevelStateSchema } from "./LevelStateSchema";

const MakeMoveMessageSchema = z.object({
  type: z.literal("MAKE_MOVE"),
  from: z.number(),
  to: z.number(),
});

const SetLevelStateMessageSchema = z.object({
  type: z.literal("SET_LEVEL_STATE"),
  levelState: LevelStateSchema,
});

const RequestLevelStateMessageSchema = z.object({
  type: z.literal("REQUEST_LEVEL_STATE"),
});

const LevelStateMessageSchema = z.object({
  type: z.literal("LEVEL_STATE"),
  levelState: LevelStateSchema,
});

const LevelStartedMessageSchema = z.object({
  type: z.literal("LEVEL_STARTED"),
  levelState: LevelStateSchema,
});

const LevelWonMessageSchema = z.object({
  type: z.literal("LEVEL_WON"),
  levelState: LevelStateSchema,
});

const LevelLostMessageSchema = z.object({
  type: z.literal("LEVEL_LOST"),
  levelState: LevelStateSchema,
});

const MoveMadeMessageSchema = z.object({
  type: z.literal("MOVE_MADE"),
  from: z.number(),
  to: z.number(),
  levelState: LevelStateSchema,
});

const SelectionCancelledMessageSchema = z.object({
  type: z.literal("SELECTION_CANCELLED"),
  levelState: LevelStateSchema,
});

const SelectionMadeMessageSchema = z.object({
  type: z.literal("SELECTION_MADE"),
  columnIndex: z.number(),
  selectionLength: z.number(),
  levelState: LevelStateSchema,
});

export const MessagesSchema = z.union([
  MakeMoveMessageSchema,
  SetLevelStateMessageSchema,
  RequestLevelStateMessageSchema,
  LevelStateMessageSchema,
  LevelStartedMessageSchema,
  LevelWonMessageSchema,
  LevelLostMessageSchema,
  MoveMadeMessageSchema,
  SelectionCancelledMessageSchema,
  SelectionMadeMessageSchema,
]);

export type MakeMoveMessage = z.infer<typeof MakeMoveMessageSchema>;
export type SetLevelStateMessage = z.infer<typeof SetLevelStateMessageSchema>;
export type LevelStateMessage = z.infer<typeof LevelLostMessageSchema>;
export type RequestLevelStateMessage = z.infer<
  typeof RequestLevelStateMessageSchema
>;
export type LevelStartedMessage = z.infer<typeof LevelStartedMessageSchema>;
export type LevelWonMessage = z.infer<typeof LevelWonMessageSchema>;
export type LeveLostMessage = z.infer<typeof LevelLostMessageSchema>;
export type MoveMadeMessage = z.infer<typeof MoveMadeMessageSchema>;
export type SelectionCancelledMessage = z.infer<
  typeof SelectionCancelledMessageSchema
>;
export type SelectionMadeMessage = z.infer<typeof SelectionMadeMessageSchema>;
export type Message = z.infer<typeof MessagesSchema>;
