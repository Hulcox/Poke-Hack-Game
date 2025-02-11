import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export const useWeather = (location: { lat: number; lon: number } | null) => {
  const fetchWeather = async ({ lat, lon }: { lat: number; lon: number }) =>
    api(`${process.env.NEXT_PUBLIC_API_URL}/weather?lat=${lat}&lon=${lon}`, {
      credential: true,
    });

  const weather = useMutation({
    mutationFn: fetchWeather,
  });

  useEffect(() => {
    if (location) {
      weather.mutate(location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return {
    weather: weather.data,
    isLoading: weather.isPending,
    isError: weather.isError,
  };
};
