import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface ErrorText {
  title: string;
  className?: string;
  active?: boolean;
}

const ErrorText = ({ title, className, active }: ErrorText) => {
  if (!active) return null;
  return (
    <div className={twMerge(clsx("text-white", className))}>
      <h2>{title}</h2>
    </div>
  );
};

export default ErrorText;
