import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface Loading {
  className?: string;
  active?: boolean;
  size: keyof typeof Size;
  type: keyof typeof Type;
}

enum Size {
  xs = "loading-xs",
  sm = "loading-sm",
  md = "loading-md",
  lg = "loading-lg",
}

enum Type {
  spinner = "loading-spinner",
  dots = "loading-dots",
  ring = "loading-ring",
  ball = "loading-ball",
  bars = "loading-bars",
  infinity = "loading-infinity",
}

const Loading = ({ className, active, size, type }: Loading) => {
  if (!active) return null;
  return (
    <div className={twMerge(clsx("text-white", className))}>
      <span
        className={twMerge(
          "loading loading-spinner loading-md loading-",
          Size[size],
          Type[type]
        )}
      ></span>
    </div>
  );
};

export default Loading;
