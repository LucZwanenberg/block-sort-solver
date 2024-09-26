import {
  cloneElement,
  CSSProperties,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type Props = {
  active?: boolean;
  startDelay?: number;
  duration?: number;
  enterStart?: CSSProperties;
  enterEnd?: CSSProperties;

  exitStart?: CSSProperties;
  exitEnd?: CSSProperties;

  defaultStyle?: CSSProperties;
  className?: string;

  containerElement?: JSX.Element;
};

type TransitionState =
  | "delayStart"
  | "enterStart"
  | "entering"
  | "enterEnd"
  | "exitStart"
  | "exiting"
  | "exitEnd";

const effectTimeout = (goal: VoidFunction, duration: number): VoidFunction => {
  const clear = setTimeout(goal, duration);
  return () => clearTimeout(clear);
};

const transitions = <T,>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  transitions: { from: T; to: T; duration: number }[]
) => {
  const transition = transitions.find((t) => t.from === state);
  if (transition) {
    return effectTimeout(() => {
      setState(transition.to);
    }, transition.duration);
  }
};

export const Transition: React.FC<PropsWithChildren<Props>> = ({
  active = true,
  startDelay = 0,
  duration = 1000,
  enterStart = { opacity: 0 },
  enterEnd = { opacity: 1 },
  exitStart = { opacity: 1 },
  exitEnd = { opacity: 0 },
  defaultStyle = {},
  className,
  containerElement = <div />,
  children,
}) => {
  const [state, setState] = useState<TransitionState>(
    active ? "enterStart" : "exitEnd"
  );

  useEffect(
    () =>
      transitions<TransitionState>(state, setState, [
        { from: "delayStart", to: "enterStart", duration: startDelay },
        { from: "enterStart", to: "entering", duration: 10 },
        { from: "entering", to: "enterEnd", duration: duration },

        { from: "exitStart", to: "exiting", duration: 10 },
        { from: "exiting", to: "exitEnd", duration: duration },
      ]),
    [state]
  );

  useEffect(() => {
    setState(active ? "delayStart" : "exitStart");
  }, [active]);

  if (state === "exitEnd" || state === "delayStart") {
    // Unmount the component if we are after the end or before the start
    return null;
  }

  const stateCSS: Record<TransitionState, CSSProperties> = {
    delayStart: exitEnd,
    enterStart: enterStart,
    entering: enterEnd,
    enterEnd: enterEnd,
    exitStart: exitStart,
    exiting: exitEnd,
    exitEnd: exitEnd,
  };

  return cloneElement(
    containerElement,
    {
      style: {
        transition: `all ${duration}ms ease-in-out`,
        ...defaultStyle,
        ...stateCSS[state],
      },
      className,
    },
    children
  );
};
