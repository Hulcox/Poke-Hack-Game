"use client";

import PokeCard from "@/components/pokeCard";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const getPokedex = async () => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0"
  );
  return await response.json();
};

const getTypes = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/type");
  return await response.json();
};

const Pokedex = () => {
  const [searchState, setSearchState] = useState<string>("");
  const [typesState, setTypesState] = useState<string[]>([]);

  const handleUpdateTypesState = (value: string) => {
    if (typesState.includes(value)) {
      setTypesState((prev) => [...prev.filter((name) => name != value)]);
    } else {
      setTypesState((prev) => [...prev, value]);
    }
  };

  const { data } = useQuery({ queryKey: ["pokedex"], queryFn: getPokedex });

  const { data: types } = useQuery({ queryKey: ["types"], queryFn: getTypes });

  return (
    <div className="text-neutral w-full">
      <div className="bg-base-100 text-white mx-4 my-6 p-4 flex flex-row items-center justify-between gap-4 rounded-box ring-2 ring-primary">
        <h1 className="text-lg">Pokedex</h1>
        <label className="input input-bordered border-neutral-content flex items-center justify-between gap-2 w-1/2">
          <input
            type="text"
            className="!text-xs"
            placeholder="Search pokemon"
            onChange={(e) => setSearchState(e.target.value)}
          />
          <Search />
        </label>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            Filter <SlidersHorizontal />
          </div>
          <div
            tabIndex={0}
            className="dropdown-content menu bg-neutral ring-2 ring-primary rounded-box z-[1] w-96 p-2 shadow"
          >
            {types && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm mb-2">Types:</h4>
                  <div className="flex flex-row flex-wrap gap-2 justify-start">
                    {types.results.map(
                      (type: { name: string }, key: number) => (
                        <div
                          key={key}
                          className="flex gap-2 items-center flex-1"
                        >
                          <input
                            type="checkbox"
                            checked={typesState.includes(type.name)}
                            onChange={() => handleUpdateTypesState(type.name)}
                            className="checkbox checkbox-warning"
                          />
                          {type.name}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm my-2">HP:</h4>
                  <input
                    type="range"
                    min={0}
                    max="100"
                    className="range range-info"
                  />
                </div>
                <div>
                  <h4 className="text-sm my-2">Attack:</h4>
                  <input
                    type="range"
                    min={0}
                    max="100"
                    className="range range-error"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {data && (
        <div className="flex flex-row flex-wrap gap-8 justify-center">
          {data.results.map(({ url }: { url: string }, key: number) => (
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
