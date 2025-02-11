"use client";

import { useGeolocation } from "@/hooks/useGeolocalisation";
import { useWeather } from "@/hooks/useWeather";
import ErrorText from "../error";
import Loading from "../loading";
import WeatherBadge from "./weatherBadge";
import WeatherDayNight from "./weatherDayNight";
import WeatherInfluence from "./weatherInfluence";
import WeatherLoc from "./weatherLoc";
import WeatherName from "./weatherName";
import WeatherTemp from "./weatherTemp";

const WeatherCard = () => {
  const { location, errorGeoloc, loadingGeoloc, getLocalisation } =
    useGeolocation();
  const { weather, isLoading, isError } = useWeather(location);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Loading
        size="lg"
        type="spinner"
        className="text-primary text-center"
        active={isLoading}
      />

      {weather && (
        <div className="flex-1 flex flex-col justify-center gap-4">
          <WeatherBadge weather={weather} className="self-center" />
          <WeatherName weather={weather} />
          <WeatherLoc weather={weather} />
          <WeatherDayNight weather={weather} />
          <WeatherTemp weather={weather} />

          <WeatherInfluence weather={weather} />
        </div>
      )}

      <ErrorText
        title="Impossible to get your localisation"
        active={errorGeoloc || isError}
        className="text-center text-error"
      />
      {(errorGeoloc || isError) && (
        <button className="btn btn-sm btn-primary" onClick={getLocalisation}>
          {loadingGeoloc && (
            <Loading size="sm" type="spinner" className="text-primary" active />
          )}
          Reload
        </button>
      )}
    </div>
  );
};

export default WeatherCard;
