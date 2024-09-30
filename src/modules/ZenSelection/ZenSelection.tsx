import { use, useEffect, useState } from "react";
import clsx from "clsx";

import { GameTitle } from "@/ui/GameTitle/GameTitle";
import { PlayButton } from "@/ui/PlayButton";
import { TopButton } from "@/ui/TopButton/TopButton";
import { WoodButton } from "@/ui/WoodButton/WoodButton";

import { LevelType } from "@/support/getLevelType";

import { BackgroundContext } from "../Layout/BackgroundContext";

import styles from "./ZenSelection.module.css";

type Props = {
  levelNr: number;
  onLevelStart: (levelType: LevelType, difficulty: [number, number]) => void;
  onZenModeEnd?: VoidFunction;
  onOpenSettings?: VoidFunction;
};

type DifficultyLevel = {
  name: string;
  unlocksAtLevel: number;
  levelRange: [number, number];
};

type UnlockableLevelType = {
  name: string;
  levelType: LevelType;
  unlocksAtLevel: number;
};

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { name: "Starter", unlocksAtLevel: 50, levelRange: [0, 2] },
  { name: "Junior", unlocksAtLevel: 50, levelRange: [3, 4] },
  { name: "Expert", unlocksAtLevel: 75, levelRange: [5, 6] },
  { name: "Master", unlocksAtLevel: 200, levelRange: [7, 8] },
  { name: "Wizard", unlocksAtLevel: 300, levelRange: [9, 10] },
];

export const LEVEL_TYPES: UnlockableLevelType[] = [
  { name: "Normal", levelType: "normal", unlocksAtLevel: 0 },
  { name: "Special", levelType: "special", unlocksAtLevel: 75 },
  { name: "Hard", levelType: "hard", unlocksAtLevel: 100 },
  { name: "Scrambled", levelType: "scrambled", unlocksAtLevel: 200 },
];

export const ZenSelection: React.FC<Props> = ({
  levelNr,
  onZenModeEnd,
  onLevelStart,
  onOpenSettings,
}) => {
  const [, setTheme] = use(BackgroundContext);
  useEffect(() => {
    setTheme("easy");
  }, []);

  // Synch with offline state
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const [levelTypeIndex, setLevelTypeIndex] = useState(0);

  const selectedDifficulty = DIFFICULTY_LEVELS[difficultyIndex];
  const selectedLevelType = LEVEL_TYPES[levelTypeIndex];
  const enabledDifficulties = DIFFICULTY_LEVELS.length;
  const enabledLevelTypes = LEVEL_TYPES.length;

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-row p-2 gap-x-2 w-full">
        {onOpenSettings && (
          <TopButton buttonType="settings" onClick={onOpenSettings} />
        )}
        <GameTitle />
        {onOpenSettings && <div className="size-block"></div>}
      </div>
      <div className="flex-1 flex flex-col gap-7">
        <div className="text-center">
          <span className="text-4xl">🌻</span>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <WoodButton
            onClick={() => {
              setDifficultyIndex(
                (a) => (a - 1 + enabledDifficulties) % enabledDifficulties
              );
            }}
          >
            <span className="inline-block translate-y-[5px] px-2">◀</span>︎
          </WoodButton>
          <div className="w-[200px]">
            <div
              className={clsx(styles.text, {
                [styles.disabled]:
                  levelNr < selectedDifficulty.unlocksAtLevel - 1,
                [styles.enabled]:
                  levelNr >= selectedDifficulty.unlocksAtLevel - 1,
              })}
            >
              {selectedDifficulty.name}
            </div>
            {selectedDifficulty.unlocksAtLevel - 1 > levelNr && (
              <div className="text-center -mt-2">
                Unlocks at level {selectedDifficulty.unlocksAtLevel}
              </div>
            )}
          </div>
          <WoodButton
            onClick={() => {
              setDifficultyIndex((a) => (a + 1) % enabledDifficulties);
            }}
          >
            <span className="inline-block translate-y-[5px] px-2">▶</span>︎ ︎
          </WoodButton>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <WoodButton
            onClick={() => {
              setLevelTypeIndex(
                (a) => (a - 1 + enabledLevelTypes) % enabledLevelTypes
              );
            }}
          >
            <span className="inline-block translate-y-[5px] px-2">◀</span>︎
          </WoodButton>
          <div className="w-[200px]">
            <div
              className={clsx(styles.text, {
                [styles.disabled]:
                  levelNr < selectedLevelType.unlocksAtLevel - 1,
                [styles.enabled]:
                  levelNr >= selectedLevelType.unlocksAtLevel - 1,
              })}
            >
              {selectedLevelType.name}
            </div>
            {selectedLevelType.unlocksAtLevel - 1 > levelNr && (
              <div className="text-center -mt-2">
                Unlocks at level {selectedLevelType.unlocksAtLevel}
              </div>
            )}
          </div>
          <WoodButton
            onClick={() => {
              setLevelTypeIndex((a) => (a + 1) % enabledLevelTypes);
            }}
          >
            <span className="inline-block translate-y-[5px] px-2">▶</span>︎ ︎
          </WoodButton>
        </div>
      </div>
      <div className="text-center pb-10 flex flex-row justify-between w-full px-5">
        <div className={"block"}>
          <button
            onClick={onZenModeEnd}
            className={clsx(
              "inline-block h-12 rounded-3xl shadow-lg font-bold pt-3 px-6 bg-orange-500 active:scale-90 transition-transform"
            )}
          >
            <span className={"block -translate-y-1 scale-150"}>◀︎</span>
          </button>
        </div>
        <PlayButton
          label={selectedDifficulty.name}
          onClick={() => {}}
          type={selectedLevelType.levelType}
          disabled={
            levelNr < selectedDifficulty.unlocksAtLevel - 1 ||
            levelNr < selectedLevelType.unlocksAtLevel - 1
          }
        />
        <div className={clsx("block transition-opacity opacity-0")}>
          <button
            onClick={() => {
              onLevelStart(
                selectedLevelType.levelType,
                selectedDifficulty.levelRange
              );
            }}
            className={clsx(
              "inline-block h-12 rounded-3xl shadow-lg font-bold pt-3 px-6 bg-orange-500",
              "invisible"
            )}
          >
            <span className={"block -translate-y-1 scale-150"}>▸</span>
          </button>
        </div>
      </div>
    </div>
  );
};
