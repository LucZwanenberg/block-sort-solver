import { useEffect, useState } from "react";

import { Transition } from "@/ui/Transition/Transition.tsx";

import { sound } from "@/audio.ts";
import { ZEN_MODE } from "@/featureFlags.ts";
import { LevelSettings } from "@/game/level-creation/generateRandomLevel.ts";
import {
  getEasySettings,
  getHardSettings,
  getNormalSettings,
  getScrambledSettings,
  getSpecialSettings,
} from "@/game/level-settings/levelSettings.ts";
import { LevelLoader } from "@/modules/Level/LevelLoader.tsx";
import { LevelTrack } from "@/modules/LevelTrack/LevelTrack.tsx";
import { getLevelType, LevelType } from "@/support/getLevelType.ts";
import { generateNewSeed, mulberry32 } from "@/support/random.ts";
import { useGameStorage } from "@/support/useGameStorage.ts";

import { BASE_SEED, SCREEN_TRANSITION } from "./constants.ts";

type Props = {
  active: boolean;
  onOpenSettings: VoidFunction;
  onZenModeStart: VoidFunction;
};

export const NormalMode: React.FC<Props> = ({
  active,
  onOpenSettings,
  onZenModeStart,
}) => {
  const [levelNr, setLevelNr] = useGameStorage("levelNr", 49);
  const [levelSeed, setLevelSeed] = useState(() =>
    generateNewSeed(BASE_SEED, levelNr)
  );
  const [inLevel, setInLevel] = useGameStorage("inLevel", false);

  useEffect(() => {
    setLevelSeed(generateNewSeed(BASE_SEED, levelNr));
  }, [levelNr]);

  const random = mulberry32(levelSeed);
  const settingProducers: Record<LevelType, (nr: number) => LevelSettings> = {
    easy: (nr: number) => getEasySettings(nr, random),
    hard: (nr: number) => getHardSettings(nr, random),
    normal: (nr: number) => getNormalSettings(nr, random),
    special: (nr: number) => getSpecialSettings(nr, random),
    scrambled: (nr: number) => getScrambledSettings(nr),
  };
  const settings = settingProducers[getLevelType(levelNr)](levelNr);

  return (
    <>
      <Transition
        className={"h-full"}
        active={!inLevel && active}
        startDelay={SCREEN_TRANSITION /* wait for level to be unmounted */}
        duration={SCREEN_TRANSITION}
      >
        <LevelTrack
          levelNr={levelNr}
          hasZenMode={levelNr >= 49 && ZEN_MODE}
          onLevelStart={() => {
            // tie playback to user interaction
            sound.play("music");
            setInLevel(true);
          }}
          onOpenSettings={onOpenSettings}
          onZenModeStart={onZenModeStart}
        />
      </Transition>
      <Transition
        className={"h-full"}
        active={inLevel && active}
        startDelay={
          SCREEN_TRANSITION /* wait for level track to be unmounted */
        }
        duration={SCREEN_TRANSITION}
      >
        <LevelLoader
          onComplete={(won) => {
            setInLevel(false);
            if (won) {
              setLevelNr((nr) => nr + 1);
            }
          }}
          levelNr={levelNr}
          levelType={getLevelType(levelNr)}
          seed={levelSeed}
          levelSettings={settings}
          title={`Level ${levelNr + 1}`}
        />
      </Transition>
    </>
  );
};
