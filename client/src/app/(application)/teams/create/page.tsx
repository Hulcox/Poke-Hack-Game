"use client";
import SearchFilter from "@/components/filter/searchFilter";
import TypesFilter from "@/components/filter/typesFilter";
import TeamForm from "@/components/form/TeamForm";
import PokeCard from "@/components/pokeCard";
import { PokemonFormSchema } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const getPokedex = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_POKEAPI_URL}/pokemon?limit=151&offset=0`
  );
  return await response.json();
};

const CreateTeamPage = () => {
  const [pokemonListState, setPokemonListState] = useState(
    [] as PokemonFormSchema[]
  );
  const [searchState, setSearchState] = useState<string>("");
  const [typesState, setTypesState] = useState<string[]>([]);

  const { data } = useQuery({ queryKey: ["pokedex"], queryFn: getPokedex });

  const addPokemon = (
    id: number,
    name: string,
    img: string,
    hp: number,
    attack: number
  ) => {
    const isDuplicate = pokemonListState.some((pokemon) => pokemon.id === id);

    if (!isDuplicate && pokemonListState.length < 6) {
      setPokemonListState([...pokemonListState, { id, name, img, hp, attack }]);
    }
  };

  const isSelected = (name: string) =>
    pokemonListState.some((pokemon) => pokemon.name === name);

  return (
    <div className="flex flex-col gap-4 w-full bg-neutral-content p-4">
      <div className="w-full bg-base-100 rounded-box ring-4 ring-neutral p-4 sticky top-3 z-10">
        <TeamForm
          pokemonListState={pokemonListState}
          setPokemonListState={setPokemonListState}
          btnLabel="Create team"
        />
      </div>
      <div className="w-full bg-base-100 flex-1 rounded-box ring-4 ring-neutral p-8">
        <div className="flex justify-between mb-8">
          <SearchFilter setSearchState={setSearchState} />
          <TypesFilter typesState={typesState} setTypesState={setTypesState} />
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-8">
          {data?.results.map(
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

export default CreateTeamPage;
