import type { Character } from "./heritage-data";

export type Player = {
  id: string;
  character: Character;
  pos: number;
  points: number;
};

export type Settings = {
  sound: boolean;
  music: boolean;
  volume: number;
  animations: boolean;
  videoSound: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  sound: true,
  music: true,
  volume: 0.5,
  animations: true,
  videoSound: true,
};
