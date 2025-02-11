import { Weather } from "@/lib/types";
import {
  typeStrengthByWeather,
  typeWeaknessesByWeather,
} from "@/utils/pokemonTypes";
import TypeBadge from "../type/typeBadge";

const WeatherInfluence = ({ weather }: { weather: Weather }) => {
  return (
    <div className="flex justify-between mt-4">
      <div>
        <p className="text-xs text-success">Strengthened type</p>
        <div className="pt-4 flex flex-wrap gap-4">
          {typeStrengthByWeather(
            weather.weather[0].main,
            weather.main.temp,
            weather.wind.speed,
            weather.sys.sunset,
            weather.sys.sunrise
          ).map((type, key) => (
            <TypeBadge key={key} type={type} />
          ))}
        </div>
      </div>
      <div className="divider divider-horizontal"></div>
      <div>
        <p className="text-xs text-error">Weakened type</p>
        <div className="pt-4 flex flex-wrap gap-4">
          {typeWeaknessesByWeather(
            weather.weather[0].main,
            weather.main.temp,
            weather.wind.speed,
            weather.sys.sunset,
            weather.sys.sunrise
          ).map((type, key) => (
            <TypeBadge key={key} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherInfluence;
