import { Weather } from "@/lib/types";
import { Wind } from "lucide-react";

const WeatherWind = ({ weather }: { weather: Weather }) => {
  return (
    <p className="flex gap-4">
      <Wind /> {weather.wind.speed} km/h
    </p>
  );
};

export default WeatherWind;
