import { usePokedex } from "@/hooks/usePokemon";
import { PokemonFormSchema } from "@/lib/types";
import { useState } from "react";
import SearchFilter from "../filter/searchFilter";
import TypesFilter from "../filter/typesFilter";
import PokeCard from "./pokemonCard";

interface PokeCardListProps {
  selectedPokemons: PokemonFormSchema[];
  setSelectedPokemons: React.Dispatch<
    React.SetStateAction<PokemonFormSchema[]>
  >;
}

const PokeCardList = ({
  selectedPokemons = [],
  setSelectedPokemons,
}: PokeCardListProps) => {
  const [searchState, setSearchState] = useState<string>("");
  const [typesState, setTypesState] = useState<string[]>([]);

  const { pokedex } = usePokedex();

  const addPokemon = (pokemon: PokemonFormSchema) => {
    if (setSelectedPokemons) {
      if (
        !selectedPokemons.some((p) => p.id === pokemon.id) &&
        selectedPokemons.length < 6
      ) {
        setSelectedPokemons([...selectedPokemons, pokemon]);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between mb-8 w-full">
        <SearchFilter
          setSearchState={setSearchState}
          placeholder="Search Pokemon"
        />
        <TypesFilter typesState={typesState} setTypesState={setTypesState} />
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-8">
        {pokedex &&
          pokedex.results.map(
            ({ url, name }: { url: string; name: string }, key: number) => (
              <PokeCard
                key={key}
                url={url}
                searchState={searchState}
                typesFilter={typesState}
                callback={addPokemon}
                className={`cursor-pointer ${
                  selectedPokemons.some((p) => p.name === name) &&
                  "brightness-50 hover:scale-100 cursor-not-allowed"
                }`}
              />
            )
          )}
      </div>
    </>
  );
};

export default PokeCardList;
