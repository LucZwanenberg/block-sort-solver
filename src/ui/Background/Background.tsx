import { PropsWithChildren } from "react";
import clsx from "clsx";

import { BlockTheme } from "@/game/themes";
import { LevelType } from "@/support/getLevelType";

import { CSSParticles } from "./CSSParticles";

type Props = {
  levelType?: LevelType;
  theme?: BlockTheme;
  disableParticles?: boolean;
  layout?: string;
};

export const Background: React.FC<PropsWithChildren<Props>> = ({
  children,
  levelType,
  disableParticles = false,
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
              "-rotate-12": layout === "levelTrack",
              "rotate-[372deg] translate-x-[100vw] -left-20":
                layout === "zenMode",
            }
          )}
        >
          🎃
        </div>
      )}
      {theme === "winter" && (
        <div className="absolute left-0 bottom-0 text-8xl">🎄</div>
      )}
      {theme === "winter" && (
        <div className="absolute right-0 top-3/4 text-8xl -rotate-45 translate-x-8">
          ⛄️
        </div>
      )}
      <div className="absolute left-0 top-0 h-safe-area w-full">{children}</div>
      {!disableParticles && theme === "halloween" && (
        <CSSParticles
          symbol="👻"
          amount={15}
          direction="up"
          scale={[0.5, 1.8]}
        />
      )}
      {!disableParticles && theme === "winter" && (
        <CSSParticles
          symbol="❄️"
          amount={30}
          direction="down"
          scale={[0.2, 1]}
        />
      )}
    </div>
  );
};
