"use client";

import PokemonBullet from "@/components/pokemonBullet";
import { Team } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

const getTeam = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/all`, {
    credentials: "include",
  });
  return await response.json();
};

const deleteTeam = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/team/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  return await response.json();
};

const TeamPage = () => {
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ["team"],
    queryFn: getTeam,
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      refetch();
    },
  });

  const goToCreatePage = () => {
    router.push("/teams/create");
  };

  const goToUpdatePage = (id: number) => {
    router.push(`/teams/update/${id}`);
  };

  return (
    <div className="w-full h-dvh p-8">
      <div className="bg-base-100 rounded-box ring-4 ring-neutral p-4 h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl">My Teams</h2>
          <button className="btn btn-sm btn-primary" onClick={goToCreatePage}>
            Create a new team
          </button>
        </div>
        <div className="mt-12">
          {isSuccess &&
            data.map((team: Team, key: number) => (
              <div key={key}>
                <div className="divider"></div>
                <div className="flex items-center justify-between">
                  <h4>
                    #<span className="text-primary">{team.id}</span>
                  </h4>
                  <h4>{team.name}</h4>
                  <div className="flex items-center gap-4">
                    {team.pokemonIds.map((id: string, key) => (
                      <PokemonBullet
                        key={key}
                        url={`${process.env.NEXT_PUBLIC_POKEAPI_URL}/pokemon/${id}`}
                      />
                    ))}
                  </div>
                  <h4>
                    Total Hp:<span className="text-info">{team.totalHp}</span>
                  </h4>
                  <div className="flex justify-center gap-4">
                    <button
                      className="btn btn-square btn-outline btn-sm text-neutral btn-success"
                      onClick={() => goToUpdatePage(team.id)}
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn btn-square btn-outline btn-sm text-neutral btn-error"
                      onClick={() => mutation.mutate(team.id)}
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
