import clsx from "clsx";

type Props = {
  levelNr: number;
  special?: boolean;
  hard?: boolean;
  onClick: VoidFunction;
};

export const PlayButton: React.FC<Props> = ({
  levelNr,
  onClick,
  special,
  hard,
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "inline-block w-[10rem] h-12 rounded-3xl shadow-lg font-bold pt-3",
      {
        "bg-orange-500": !special,
        "bg-purple-500": special,
      }
    )}
  >
    <span
      className={`block ${(hard || special) == false ? "-translate-y-1" : ""}`}
    >
      Level {levelNr}
    </span>
    {special && (
      <span className="inline-block text-xs translate-y-1 bg-purple-400 px-2 py-1 shadow rounded-md">
        ⭐️ special
      </span>
    )}
    {hard && (
      <span className="inline-block text-xs translate-y-1 bg-orange-600 px-2 py-1 shadow rounded-md">
        🔥️ hard
      </span>
    )}
  </button>
);
