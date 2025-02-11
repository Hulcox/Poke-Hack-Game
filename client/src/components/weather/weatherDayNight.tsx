import { Weather } from "@/lib/types";
import { DateTime } from "luxon";

const WeatherDayNight = ({ weather }: { weather: Weather }) => {
  return (
    <div className="flex gap-6">
      <p>
        <span className="text-primary">Sunrise:</span>
        {DateTime.fromSeconds(weather.sys.sunrise).toFormat("HH:mm")}
      </p>
      <p>
        <span className="text-primary">Sunset:</span>
        {DateTime.fromSeconds(weather.sys.sunset).toFormat("HH:mm")}
      </p>
    </div>
  );
};

export default WeatherDayNight;
