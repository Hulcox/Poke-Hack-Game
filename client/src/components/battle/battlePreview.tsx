"use client";
import { Team, Weather } from "@/lib/types";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import BtnForm from "../form/btnForm";
import TeamInfo from "../team/teamInfo";
import WeatherBadge from "../weather/weatherBadge";
import WeatherInfluence from "../weather/weatherInfluence";
import WeatherName from "../weather/weatherName";

interface BattlePreviewProps {
  attackerTeam: Team;
  defenderTeam: Team;
  weather: Weather;
  goBack?: () => void;
}

const schema = z.object({
  attackerTeamId: z.number(),
  defenderTeamId: z.number(),
});

type Inputs = z.infer<typeof schema>;

const BattlePreview = ({
  attackerTeam,
  defenderTeam,
  weather,
  goBack,
}: BattlePreviewProps) => {
  const { handleSubmit, reset } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      attackerTeamId: attackerTeam.id,
      defenderTeamId: defenderTeam.id,
    },
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: Inputs) =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/battle/start`, {
        method: "POST",
        data: data,
        credential: true,
      }),
    onSuccess: (data) => {
      console.log(data);
      router.push(`/battle/${data.id}`);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    mutation.mutate(data);
  };

  useEffect(() => {
    reset({ attackerTeamId: attackerTeam.id, defenderTeamId: defenderTeam.id });
  }, [attackerTeam, defenderTeam, reset]);

  return (
    <div className=" p-4  rounded-lg shadow">
      <div className="flex items-baseline gap-4">
        {goBack && (
          <button className="btn btn-sm btn-square" onClick={goBack}>
            <ChevronLeft />
          </button>
        )}
        <h4 className="text-xl mb-4">Battle Preview</h4>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full w-full gap-6"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <WeatherBadge weather={weather} />
          <WeatherName weather={weather} />
          <WeatherInfluence weather={weather} />
        </div>
        <div className="space-y-8 mt-8">
          <h4>Your team:</h4>
          <div className="flex flex-col items-center justify-center gap-4">
            <TeamInfo
              pokemons={attackerTeam.pokemons}
              totalHp={attackerTeam.totalHp}
            />
          </div>
          <div className="divider">vs</div>
          <div className="flex flex-col items-center justify-center gap-4">
            <TeamInfo
              pokemons={defenderTeam.pokemons}
              totalHp={defenderTeam.totalHp}
            />
          </div>
        </div>
        <div className="w-full text-end">
          <BtnForm btnLabel={"Start battle"} mutation={mutation} />
        </div>
      </form>
    </div>
  );
};

export default BattlePreview;
