import { Weather } from "@/lib/types";
import { ThermometerSun } from "lucide-react";

const WeatherTemp = ({ weather }: { weather: Weather }) => {
  return (
    <p className="flex gap-4">
      <ThermometerSun /> {weather.main.temp}°C
    </p>
  );
};

export default WeatherTemp;
