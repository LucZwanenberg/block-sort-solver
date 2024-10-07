import { Dispatch, Suspense, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { Checkbox } from "@/ui/Checkbox";
import { Dialog } from "@/ui/Dialog/Dialog";
import { DialogTitle } from "@/ui/Dialog/DialogTitle";
import { Transition } from "@/ui/Transition/Transition";

import info from "@/../package.json";
import { THEMES } from "@/featureFlags";

import { Attribution } from "./Attribution";
import { Changelog } from "./Changelog";

type Props = {
  soundEnabled?: boolean;
  musicEnabled?: boolean;
  themesEnabled?: boolean;
  onSoundChange?: Dispatch<boolean>;
  onMusicChange?: Dispatch<boolean>;
  onThemesChange?: Dispatch<boolean>;
  onClose?: VoidFunction;
};

export const Settings: React.FC<Props> = ({
  soundEnabled = true,
  musicEnabled = true,
  themesEnabled = true,
  onSoundChange,
  onMusicChange,
  onThemesChange,
  onClose,
}) => {
  const dialogElement = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<
    "settings" | "changes" | "attribution"
  >("settings");

  useEffect(() => {
    dialogElement.current?.showModal();
  }, []);

  return (
    <Dialog
      ref={dialogElement}
      wide={activeTab === "changes"}
      onClose={() => {
        dialogElement.current?.close();
        onClose?.();
      }}
    >
      <DialogTitle>BlockSort, v{info.version}</DialogTitle>

      {activeTab === "settings" && (
        <div className="flex flex-col gap-3">
          <Checkbox
            value={soundEnabled}
            onChange={(value) => onSoundChange?.(value)}
            label="Sound Effects"
          />
          <Checkbox
            value={musicEnabled}
            onChange={(value) => onMusicChange?.(value)}
            label="Music"
          />
          {THEMES && (
            <Checkbox
              value={themesEnabled}
              onChange={(value) => onThemesChange?.(value)}
              label="Seasonal Themes"
              description="Automatically switch to themed content when available"
            />
          )}
          <Transition
            active={themesEnabled}
            enterStart={{ opacity: 0, height: "0rem" }}
            enterEnd={{ opacity: 1, height: "3rem" }}
            exitStart={{ opacity: 1, height: "3rem" }}
            exitEnd={{ opacity: 0, height: "0rem" }}
            duration={300}
          >
            <div className="pl-10">
              <p>Peekaboo!</p>
            </div>
          </Transition>
          {"share" in navigator && (
            <button
              className={clsx(
                "inline-block rounded-full border border-black p-2 shadow-md",
                "bg-black bg-clip-text text-transparent",
                "active:scale-90 transition-transform"
              )}
              onClick={async () => {
                try {
                  await navigator.share({
                    title: "Block Sort",
                    url: "https://matthijsgroen.github.io/block-sort/",
                    text: "A block sorting puzzle game. No ads, cookies, tracking or payments. Just the pure fun!",
                  });
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                  // Nothing to do, user probably canceled the share
                }
              }}
            >
              ❤︎ Share
            </button>
          )}
          <p className="text-xs">
            <a
              href="https://github.com/matthijsgroen"
              target="_blank"
              rel="nofollow noreferrer"
              className="underline"
            >
              Matthijs Groen
            </a>
            , 2024
          </p>
          <div className="flex flex-row justify-between">
            <button
              className={clsx(
                "inline-block rounded-full border border-black p-2 shadow-md text-black text-sm px-4",
                "active:scale-90 transition-transform"
              )}
              onClick={() => setActiveTab("changes")}
            >
              Recent changes
            </button>
            <button
              className={clsx(
                "inline-block rounded-full border border-black p-2 shadow-md text-black text-sm px-4",
                "active:scale-90 transition-transform"
              )}
              onClick={() => setActiveTab("attribution")}
            >
              Attribution
            </button>
          </div>
          <div className="flex flex-row justify-between pb-4">
            <button
              className={clsx(
                "inline-block rounded-full border border-black p-2 shadow-md text-black text-sm px-4",
                "active:scale-90 transition-transform"
              )}
              onClick={() => setActiveTab("changes")}
            >
              Data transfer
            </button>
          </div>
        </div>
      )}
      {activeTab === "changes" && (
        <div className="flex flex-col gap-3">
          <button
            className={clsx(
              "inline-block rounded-full border border-black p-2 shadow-md text-black text-sm px-4",
              "active:scale-90 transition-transform"
            )}
            onClick={() => setActiveTab("settings")}
          >
            Back
          </button>
          <Suspense fallback={<div>Loading...</div>}>
            <Changelog />
          </Suspense>
        </div>
      )}
      {activeTab === "attribution" && (
        <div className="flex flex-col gap-3">
          <button
            className={clsx(
              "inline-block rounded-full border border-black p-2 shadow-md text-black text-sm px-4",
              "active:scale-90 transition-transform"
            )}
            onClick={() => setActiveTab("settings")}
          >
            Back
          </button>
          <Attribution />
        </div>
      )}
    </Dialog>
  );
};
