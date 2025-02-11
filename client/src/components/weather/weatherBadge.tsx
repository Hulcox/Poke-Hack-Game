import clsx from "clsx";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const WeatherBadge = ({
  icon,
  alt,
  className,
}: {
  icon: string;
  alt: string;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "w-32 h-32 bg-neutral-content ring-8 ring-base-300 rounded-full relative",
          className
        )
      )}
    >
      <Image
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={alt}
        fill
      />
    </div>
  );
};

export default WeatherBadge;
