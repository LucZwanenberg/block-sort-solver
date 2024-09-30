import clsx from "clsx";

import { Block } from "../Block/Block";

import styles from "./GameTitle.module.css";

export const GameTitle: React.FC = () => (
  <h1
    className={clsx(
      "text-3xl mb-2 font-extrabold flex-1 text-center text-orange-400 font-block-sort",
      styles.header
    )}
  >
    Bl
    <div className="inline-block text-sm scale-50 -mx-2 translate-y-1">
      <Block moved={true} color="#fb923c" shape="️⭐️" revealed />
    </div>
    ck S
    <div className="inline-block text-sm scale-50 -mx-2 translate-y-1">
      <Block moved={true} color="#fb923c" shape="️🧩" revealed />
    </div>
    rt
  </h1>
);
