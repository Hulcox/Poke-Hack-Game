import clsx from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const BoxGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-neutral rounded-box transition-all hover:scale-[1.02] p-4",
          className
        )
      )}
    >
      {children}
    </div>
  );
};

export default BoxGrid;
