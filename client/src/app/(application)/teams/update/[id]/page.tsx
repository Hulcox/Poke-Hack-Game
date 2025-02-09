"use client";
import SearchFilter from "@/components/filter/searchFilter";
import TypesFilter from "@/components/filter/typesFilter";
import TeamForm from "@/components/form/TeamForm";
import PokeCard from "@/components/pokeCard";
import { PokemonData, PokemonFormSchema } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const getPokedex = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_POKEAPI_URL}/pokemon?limit=151&offset=0`
  );
  return await response.json();
};

const getTeam = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/team/${id}`,
    {
      credentials: "include",
    }
  );
  return await response.json();
};

const getPokemon = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

const UpdateTeamPage = () => {
  const [pokemonListState, setPokemonListState] = useState(
    [] as PokemonFormSchema[]
  );
  const [searchState, setSearchState] = useState<string>("");
  const [typesState, setTypesState] = useState<string[]>([]);

  const { id } = useParams();

  const {
    data: team,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["team", id],
    queryFn: () => getTeam(`${id}`),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: pokemonList } = useQuery({
    queryKey: ["pokedex"],
    queryFn: getPokedex,
  });

  useEffect(() => {
    if (team?.pokemonIds.length > 0) {
      team?.pokemonIds.forEach((id: string) => {
        getPokemon(`${process.env.NEXT_PUBLIC_POKEAPI_URL}/pokemon/${id}`).then(
          (pokemon: PokemonData) => {
            addPokemon(
              pokemon.id,
              pokemon.name,
              pokemon.sprites.front_default,
              pokemon.stats[0].base_stat,
              pokemon.stats[1].base_stat
            );
          }
        );
      });
    }
  }, [team]);

  const addPokemon = (
    id: number,
    name: string,
    img: string,
    hp: number,
    attack: number
  ) => {
    setPokemonListState((prev) => {
      if (prev.some((pokemon) => pokemon.id === id) || prev.length >= 6) {
        return prev;
      }
      return [...prev, { id, name, img, hp, attack }];
    });
  };

  const isSelected = (name: string) =>
    pokemonListState.some((pokemon) => pokemon.name === name);

  return (
    <div className="flex flex-col gap-4 w-full bg-neutral-content p-4">
      <div className="w-full bg-base-100 rounded-box ring-4 ring-neutral p-4 sticky top-3 z-10">
        {isError && <div>Error</div>}
        {isLoading && <div>is Loading</div>}
        {isSuccess && (
          <TeamForm
            pokemonListState={pokemonListState}
            setPokemonListState={setPokemonListState}
            btnLabel="Update team"
            nameField={team.name}
            isUpdate
            idTeam={`${id}`}
          />
        )}
      </div>
      <div className="w-full bg-base-100 flex-1 rounded-box ring-4 ring-neutral p-8">
        <div className="flex justify-between mb-8">
          <SearchFilter setSearchState={setSearchState} />
          <TypesFilter typesState={typesState} setTypesState={setTypesState} />
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-8">
          {pokemonList?.results.map(
            ({ url, name }: { url: string; name: string }, key: number) => (
              <PokeCard
                key={key}
                url={url}
                searchState={searchState}
                typesFilter={typesState}
                callback={(pokemon) =>
                  addPokemon(
                    pokemon.id,
                    pokemon.name,
                    pokemon.img,
                    pokemon.hp,
                    pokemon.attack
                  )
                }
                className={`cursor-pointer ${
                  isSelected(name) &&
                  "brightness-50 hover:scale-100 cursor-not-allowed"
                }`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateTeamPage;
