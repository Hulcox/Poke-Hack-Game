import { Weather } from "@/lib/types";
import clsx from "clsx";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const WeatherBadge = ({
  weather,
  className,
}: {
  weather: Weather;
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
        src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
        fill
      />
    </div>
  );
};

export default WeatherBadge;
