import {
  getOfflineValue,
  useOfflineStorage,
} from "@/support/useOfflineStorage";

const GAME_STORE = "block-sort-store";

export const useGameStorage = <T>(key: string, initialValue: T) =>
  useOfflineStorage<T>(key, initialValue, GAME_STORE);

export const getGameValue = <T>(key: string) =>
  getOfflineValue<T>(key, GAME_STORE);
