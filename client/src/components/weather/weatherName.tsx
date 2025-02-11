import { Weather } from "@/lib/types";

const WeatherName = ({ weather }: { weather: Weather }) => {
  return (
    <h3 className="text-center py-4">
      {weather.weather[0].main}{" "}
      <span className="text-sm">({weather.weather[0].description})</span>
    </h3>
  );
};

export default WeatherName;
