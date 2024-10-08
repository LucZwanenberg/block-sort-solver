import { use, useEffect, useState } from "react";
import clsx from "clsx";

import { GameTitle } from "@/ui/GameTitle/GameTitle";
import { Smiley } from "@/ui/Smiley/Smiley";
import { TopButton } from "@/ui/TopButton/TopButton";
import { ZenButton } from "@/ui/ZenButton";

import {
  isEasy,
  isHard,
  isScrambled,
  isSpecial,
  LEVEL_SCALE,
} from "@/game/level-settings/levelSettings";
import { getLevelType } from "@/support/getLevelType";

import { PlayButton } from "../../ui/PlayButton";
import { BackgroundContext } from "../Layout/BackgroundContext";
import { BetaContext } from "../Layout/BetaContext";

import styles from "./levelTrack.module.css";

type Props = {
  levelNr: number;
  hasZenMode?: boolean;
  showInstallButton?: boolean;
  onInstall?: VoidFunction;
  onLevelStart: VoidFunction;
  onZenModeStart?: VoidFunction;
  onOpenSettings?: VoidFunction;
};

const translates = [
  "",
  "translate-x-10",
  "translate-x-20",
  "translate-x-10",
  "",
  "-translate-x-10",
  "-translate-x-20",
  "-translate-x-10",
];

export const LevelTrack: React.FC<Props> = ({
  levelNr,
  hasZenMode = false,
  showInstallButton = false,
  onInstall,
  onZenModeStart,
  onLevelStart,
  onOpenSettings,
}) => {
  const startNumbering = Math.max(Math.floor(levelNr - 2), 0);

  const levelNrs = new Array(30).fill(0).map((_, i) => startNumbering + i);

  const { setLevelType, setScreenLayout } = use(BackgroundContext);
  useEffect(() => {
    setLevelType(undefined);
    setScreenLayout("levelTrack");
  }, []);
  const { setShowBeta } = use(BetaContext);
  const [betaCounter, setBetaCounter] = useState(0);

  useEffect(() => {
    if (betaCounter > 7) {
      setShowBeta(true);
    }
  }, [betaCounter]);

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-row pt-2 pl-safeLeft pr-safeRight gap-x-2 w-full">
        <TopButton buttonType="settings" onClick={onOpenSettings} />
        <GameTitle
          onClick={() => {
            setBetaCounter((counter) => counter + 1);
          }}
        />
        {!showInstallButton && <div className="size-block"></div>}
        {showInstallButton && (
          <TopButton
            buttonType="install"
            onClick={() => {
              onInstall?.();
            }}
            highlight
          />
        )}
      </div>

      <ol className="flex flex-col-reverse w-full flex-1 overflow-y-hidden">
        {levelNrs.map((i) => {
          const offset = i % 8;
          const levelTransition = LEVEL_SCALE.includes(i);
          return (
            <li
              key={i}
              style={{ "--levelNr": `'${LEVEL_SCALE.indexOf(i) + 1}'` }}
              className={clsx(
                "flex align-middle items-center w-full h-height-block flex-shrink-0 justify-center",
                {
                  [styles.levelUp]: levelTransition,
                }
              )}
            >
              <div
                className={clsx(
                  translates[offset],
                  "whitespace-nowrap leading-10 align-middle mx-auto"
                )}
              >
                <span
                  className={clsx(
                    "text-orange-400",
                    {
                      "text-green-900": i < levelNr,
                      "font-bold": i === levelNr,
                      "text-purple-500": isSpecial(i) && i >= levelNr,
                      "text-green-700": isEasy(i) && i >= levelNr,
                      "text-slate-400": isScrambled(i) && i >= levelNr,
                    },
                    styles.textShadow
                  )}
                >
                  {i + 1}&nbsp;
                </span>
                <span
                  className={clsx(
                    "inline-block border size-block align-top rounded-md text-center bg-black/30",
                    {
                      "border border-block-brown":
                        !isSpecial(i) ||
                        !isHard(i) ||
                        !isEasy(i) ||
                        isScrambled(i),
                      "border-2 border-purple-800": isSpecial(i),
                      "border-2 border-orange-700": isHard(i),
                      "border-2 border-green-800": isEasy(i),
                      "border-2 border-slate-400": isScrambled(i),
                    }
                  )}
                >
                  {i < levelNr && (
                    <span
                      className={clsx(
                        "bg-green-500 bg-clip-text text-transparent",
                        styles.doneGlow
                      )}
                    >
                      ✔
                    </span>
                  )}
                  {i == levelNr && <Smiley />}
                  {i > levelNr && isSpecial(i) && (
                    <span
                      style={{ "--color": "#a855f7" }}
                      className={styles.colorEmoji}
                    >
                      ⭐️
                    </span>
                  )}
                  {i > levelNr && isHard(i) && "️🔥"}
                  {i > levelNr && isEasy(i) && (
                    <span
                      style={{ "--color": "#15803d" }}
                      className={styles.colorEmoji}
                    >
                      ️🍀
                    </span>
                  )}
                  {i > levelNr && isScrambled(i) && (
                    <span
                      style={{ "--color": "#94a3b8" }}
                      className={styles.colorEmoji}
                    >
                      ️🧩
                    </span>
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="text-center pb-10 flex flex-row justify-between w-full px-5">
        <button
          onClick={() => {}}
          className={clsx(
            "inline-block h-12 rounded-3xl shadow-lg font-bold pt-3 px-6 bg-orange-500",
            "invisible"
          )}
        >
          <span className={"block -translate-y-1 scale-150"}>️🌻 ▸</span>
        </button>
        <PlayButton
          label={`Level ${levelNr + 1}`}
          onClick={onLevelStart}
          type={getLevelType(levelNr)}
        />
        <div
          className={clsx("block transition-opacity", {
            ["opacity-0"]: !hasZenMode,
            ["opacity-100"]: hasZenMode,
          })}
        >
          <ZenButton
            onClick={() => {
              if (!hasZenMode) return;
              onZenModeStart?.();
            }}
          />
        </div>
      </div>
    </div>
  );
};
