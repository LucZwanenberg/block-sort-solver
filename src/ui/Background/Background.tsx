import { PropsWithChildren } from "react";
import clsx from "clsx";

import { LevelTypeString } from "@/game/level-types";
import { BlockTheme } from "@/game/themes";

import { CSSParticles } from "./CSSParticles";

type Props = {
  levelType?: LevelTypeString;
  theme?: BlockTheme;
  layout?: string;
};

export const Background: React.FC<PropsWithChildren<Props>> = ({
  children,
  levelType,
  theme = "default",
  layout = "default",
}) => {
  return (
    <div
      className={clsx(
        "h-full relative transition-all [transition-duration:1.5s] [transition-timing-function:ease-out] overflow-hidden",
        {
          "bg-transparent": levelType === undefined || levelType === "normal",
          "bg-purple-700/50": levelType === "special",
          "bg-red-600/70": levelType === "hard",
          "bg-green-600/40": levelType === "easy",
          "bg-slate-400/40": levelType === "scrambled",
        }
      )}
    >
      {theme === "halloween" && (
        <div className="absolute left-0 top-0 h-full w-full animate-lightning bg-white"></div>
      )}
      <div className="absolute left-0 top-0 h-full w-full mix-blend-multiply bg-wood-texture"></div>
      {theme === "halloween" && (
        <div
          className={clsx(
            "absolute left-0 bottom-0 text-8xl transition-all [transition-duration:2000ms]",
            {
              "translate-x-[100vw]": layout === "zenMode",
            }
          )}
        >
          <div
            className={clsx(
              "inline-block transition-all [transition-duration:2000ms]",
              {
                "-rotate-12": layout === "levelTrack",
                "rotate-[372deg] -translate-x-[90px]": layout === "zenMode",
              }
            )}
          >
            🎃
          </div>
        </div>
      )}
      {theme === "winter" && (
        <>
          <div
            className={clsx(
              "absolute right-0 bottom-0 text-8xl scale-150 origin-bottom transition-transform [transition-duration:1500ms]",
              {
                "translate-y-[150%] -rotate-12": layout === "levelTrack",
                "[transition-delay:1500ms]": layout === "zenMode",
              }
            )}
          >
            🎄
          </div>
          <div
            className={clsx(
              "absolute left-0 bottom-0 text-8xl scale-150 origin-bottom transition-transform [transition-duration:1500ms]",
              {
                "translate-y-[150%] rotate-12": layout === "zenMode",
                "[transition-delay:1500ms]": layout === "levelTrack",
              }
            )}
          >
            🎄
          </div>
        </>
      )}
      {theme === "winter" && (
        <div className="absolute right-0 top-3/4 text-8xl -rotate-45 translate-x-8">
          ⛄️
        </div>
      )}
      <div className="absolute left-0 top-0 h-safe-area w-full">{children}</div>
      {theme === "halloween" && (
        <CSSParticles
          symbol="👻"
          amount={10}
          direction="up"
          shift={200}
          scale={[0.7, 1.8]}
          speed={[30, 50]}
          floatDistance={[20, 100]}
          floatSpeed={[5, 10]}
        />
      )}
      {theme === "winter" && (
        <CSSParticles
          symbol="❄️"
          amount={30}
          shift={100}
          direction="down"
          scale={[0.2, 1]}
          speed={[30, 50]}
          floatDistance={[20, 100]}
          floatSpeed={[5, 10]}
        />
      )}
    </div>
  );
};
