import clsx from "clsx";

import { between, mulberry32 } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import styles from "./CSSParticles.module.css";

type Props = {
  symbol: string;
  amount: number;
  direction: "up" | "down";
  scale: [min: number, max: number];
  speed: [min: number, max: number];
  floatSpeed: [min: number, max: number];
  floatDistance: [min: number, max: number];
};

const SEED = 123456789;

export const CSSParticles: React.FC<Props> = ({
  symbol,
  amount,
  direction,
  scale,
  speed,
  floatDistance,
  floatSpeed,
}) => {
  const random = mulberry32(SEED);
  const yStart = direction === "up" ? "calc(100vh + 50px)" : "0vh";
  const yEnd = direction === "up" ? "0vh" : "calc(100vh + 50px)";

  return (
    <div className="absolute inset-0 pointer-events-none">
      {timesMap(amount, (i) => {
        const movement = between(speed[0], speed[1], random);
        const delay = between(0, movement, random);
        return (
          <div
            key={i}
            style={{
              left: `${Math.round(between(-2, 98, random))}vw`,
              top: "-50px",
              "--floatSpeed": `${Math.round(between(floatSpeed[0], floatSpeed[1], random) * 1000)}ms`,
              "--floatDelay": `-${Math.round(between(0, floatSpeed[0], random) * 1000)}ms`,
              "--moveSpeed": `${Math.round(movement * 1000)}ms`,
              "--delay": `-${Math.round(delay * 1000)}ms`,
              "--directionYStart": `${yStart}`,
              "--directionYEnd": `${yEnd}`,
              "--directionXStart": "0px",
              "--directionXEnd": `${between(-100, 100, random)}px`,
              "--float": `${Math.round(between(floatDistance[0], floatDistance[1], random))}px`,
              "--symbol": `"${symbol}"`,
              scale: `${between(scale[0], scale[1], random)}`,
              opacity: `${between(0.5, 0.8, random)}`,
            }}
            className={clsx(styles.float, styles.particle)}
          ></div>
        );
      })}
    </div>
  );
};
