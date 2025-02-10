"use client";

import {
  typeStrengthByWeather,
  typeWeaknessesByWeather,
} from "@/utils/pokemonTypes";
import { useMutation } from "@tanstack/react-query";
import { ThermometerSun, Wind } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import TypeBadge from "./typeBadge";
import WeatherBadge from "./weatherBadge";

const truncateToFourDecimals = (num: number) =>
  Math.trunc(num * 10_000) / 10_000;

const getWeather = async ({ lat, lon }: { lat: number; lon: number }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/weather?lat=${truncateToFourDecimals(
      lat
    )}&lon=${truncateToFourDecimals(lon)}`,
    { credentials: "include" }
  );
  return await response.json();
};

const WeatherCard = () => {
  const [errorGeoloc, setErrorGeoloc] = useState(false);
  const [loadingGeoloc, setLoadingGeoloc] = useState(false);

  const weather = useMutation({
    mutationFn: getWeather,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    getLocalisation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocalisation = () => {
    setLoadingGeoloc(true);
    setErrorGeoloc(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLoadingGeoloc(false);
          weather.mutate({ lat: latitude, lon: longitude });
        },
        (err) => {
          console.log("Error localisation not allowed", err);
          setErrorGeoloc(true);
          setErrorGeoloc(false);
        }
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1>Weather</h1>
      {weather.isPending && (
        <span className="loading-spinner loading text-primary"></span>
      )}
      {weather.isSuccess && weather.data && (
        <div className="flex-1 flex flex-col justify-center gap-4">
          <WeatherBadge
            icon={weather.data.weather[0].icon}
            alt={weather.data.weather[0].description}
            className="self-center"
          />
          <h3 className="text-center py-4">
            {weather.data.weather[0].main}{" "}
            <span className="text-sm">
              ({weather.data.weather[0].description})
            </span>
          </h3>
          <h3>
            <span className="text-primary">Loc:</span> {weather.data.name},{" "}
            {weather.data.sys.country}
          </h3>
          <div className="flex gap-6">
            <p>
              <span className="text-primary">Sunrise:</span>{" "}
              {DateTime.fromSeconds(weather.data.sys.sunrise).toFormat("HH:mm")}
            </p>
            <p>
              <span className="text-primary">Sunset:</span>{" "}
              {DateTime.fromSeconds(weather.data.sys.sunset).toFormat("HH:mm")}
            </p>
          </div>
          <p className="flex gap-4">
            <ThermometerSun />
            {weather.data.main.temp}°C
          </p>
          <p className="flex gap-4">
            <Wind />
            {weather.data.wind.speed} km/h
          </p>
          <div className="flex justify-between mt-4">
            <div>
              <p className="text-xs text-success">Strengthened type</p>
              <div className="pt-4 flex flex-wrap gap-4">
                {typeStrengthByWeather(
                  weather.data.weather[0].main,
                  weather.data.main.temp,
                  weather.data.wind.speed,
                  weather.data.sys.sunset,
                  weather.data.sys.sunrise
                ).map((type: string, key: number) => (
                  <TypeBadge key={key} type={type} />
                ))}
              </div>
            </div>
            <div className="divider divider-horizontal"></div>
            <div>
              <p className="text-xs text-error">Weakened type</p>
              <div className="pt-4 flex flex-wrap gap-4">
                {typeWeaknessesByWeather(
                  weather.data.weather[0].main,
                  weather.data.main.temp,
                  weather.data.wind.speed,
                  weather.data.sys.sunset,
                  weather.data.sys.sunrise
                ).map((type: string, key: number) => (
                  <TypeBadge key={key} type={type} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {errorGeoloc ||
        (weather.isError && (
          <div className="text-center space-y-4">
            <h3 className="text-error text-sm">
              Imposible to get your localisation
            </h3>
            <button
              className="btn btn-sm btn-primary"
              onClick={getLocalisation}
            >
              {loadingGeoloc && (
                <span className="loading loading-spinner"></span>
              )}
              Reload
            </button>
          </div>
        ))}
    </div>
  );
};

export default WeatherCard;
