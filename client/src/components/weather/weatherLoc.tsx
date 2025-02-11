import { Weather } from "@/lib/types";

const WeatherLoc = ({ weather }: { weather: Weather }) => {
  return (
    <h3>
      <span className="text-primary">Loc:</span> {weather.name},{" "}
      {weather.sys.country}
    </h3>
  );
};

export default WeatherLoc;
