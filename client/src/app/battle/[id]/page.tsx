"use client";
import BattleComponent from "@/components/battle/battleComponent";
import ErrorText from "@/components/error";
import Loading from "@/components/loading";
import { useBattle } from "@/hooks/useBattle";
import { useGeolocation } from "@/hooks/useGeolocalisation";
import { useWeather } from "@/hooks/useWeather";
import { useParams } from "next/navigation";

const BattleGamePage = () => {
  const { id } = useParams();
  const { data, isError, isLoading, isSuccess } = useBattle(`${id}`);

  const { location, errorGeoloc, loadingGeoloc } = useGeolocation();
  const {
    weather,
    isLoading: weatherLoading,
    isError: weatherError,
  } = useWeather(location);

  console.log(data, isError, isLoading, isSuccess);

  if (errorGeoloc || weatherError) {
    return (
      <div className="w-dvw h-dvh bg-neutral flex items-center justify-center">
        <ErrorText title="Impossible to get actual weather" active />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-dvw h-dvh bg-neutral flex items-center justify-center">
        <ErrorText
          title="Impossible to load the battle"
          className="text-error"
          active
        />
      </div>
    );
  }

  if (weatherLoading || loadingGeoloc || isLoading) {
    return (
      <div className="w-dvw h-dvh bg-neutral flex items-center justify-center">
        <Loading size="lg" type="spinner" active className="text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-row w-dvw h-dvh bg-gradient-to-t from-black to-white">
      <BattleComponent battle={data} weather={weather} />
    </div>
  );
};

export default BattleGamePage;
