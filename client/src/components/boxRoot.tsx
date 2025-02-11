import clsx from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const BoxRoot = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="w-full h-dvh p-8">
      <div
        className={twMerge(
          clsx(
            "bg-base-100 rounded-box ring-4 ring-neutral p-4 h-full text-white",
            className
          )
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default BoxRoot;
