"use client";

import ErrorText from "@/components/error";
import SearchFilter from "@/components/filter/searchFilter";
import TypesFilter from "@/components/filter/typesFilter";
import PokeCard from "@/components/pokemon/pokemonCard";
import { usePokedex } from "@/hooks/usePokemon";
import { BookOpenText } from "lucide-react";
import { useState } from "react";

const Pokedex = () => {
  const [searchState, setSearchState] = useState<string>("");
  const [typesState, setTypesState] = useState<string[]>([]);

  const { pokedex, isError } = usePokedex();

  return (
    <div className="text-neutral w-full">
      <div className="bg-base-100 text-white mx-4 my-6 p-4 flex flex-row items-center justify-between gap-4 rounded-box ring-2 ring-primary">
        <h1 className="text-lg flex items-center gap-4">
          <BookOpenText />
          Pokedex
        </h1>
        <SearchFilter
          setSearchState={setSearchState}
          placeholder="Search Pokemon"
        />
        <TypesFilter typesState={typesState} setTypesState={setTypesState} />
      </div>
      <ErrorText title="No Pokemon Found" active={isError} />
      {pokedex && (
        <div className="flex flex-row flex-wrap gap-8 justify-center">
          {pokedex.results.map(({ url }: { url: string }, key: number) => (
            <PokeCard
              key={key}
              url={url}
              searchState={searchState}
              typesFilter={typesState}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Pokedex;
