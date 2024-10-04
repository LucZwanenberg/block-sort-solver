import halloween from "@/assets/halloween.aac";
import lose from "@/assets/lose.mp3";
import music from "@/assets/music.aac";
import pickup from "@/assets/pickup.mp3";
import place from "@/assets/place.mp3";
import win from "@/assets/win.mp3";
import winter from "@/assets/winter.aac";

import { audioSystem, createItem, StreamItem } from "./services/audio";

export enum Stream {
  effects = "effects",
  music = "music",
}

const streams: Record<Stream, StreamItem> = {
  effects: { gain: 0.5 },
  music: { gain: 0.5 },
};

const audioItems = {
  music: createItem(Stream.music, music, 1.0, { loop: true, lazy: true }),
  halloween: createItem(Stream.music, halloween, 0.5, {
    loop: true,
    lazy: true,
  }),
  winter: createItem(Stream.music, winter, 0.5, {
    loop: true,
    lazy: true,
  }),
  lose: createItem(Stream.effects, lose, 0.5),
  place: createItem(Stream.effects, place),
  lock: createItem(Stream.effects, place, 1.0, { multipleInstances: true }),
  win: createItem(Stream.effects, win),
  pickup: createItem(Stream.effects, pickup, 2.0),
};

export type AudioItemName = keyof typeof audioItems;

export const sound = audioSystem(streams, audioItems);
