"use client";

import { PokeCardProps } from "@/lib/types";
import { TYPE_COLORS, TYPE_WEAKNESSES } from "@/utils/pokemonTypes";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const getPokemon = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

const PokeCard = ({
  url,
  searchState,
  typesFilter,
  className,
  callback,
}: PokeCardProps) => {
  const {
    data: pokemon,
    isError,
    isLoading,
    isSuccess,
  } = useQuery({ queryKey: [url], queryFn: () => getPokemon(url), retry: 0 });

  if (isLoading) {
    return (
      <div
        className={twMerge(
          clsx(
            "w-80 h-72 bg-neutral text-white rounded-box p-4 ring-4 ring-base-100 flex items-center justify-center opacity-75",
            className
          )
        )}
      >
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={twMerge(
          clsx(
            "w-80 h-72 bg-neutral text-white rounded-box p-4 ring-4 ring-base-100 flex items-center justify-center",
            className
          )
        )}
      >
        <h2>{"Doesn't exist"}</h2>
      </div>
    );
  }

  if (isSuccess) {
    const hp = pokemon.stats[0].base_stat;
    const attack = pokemon.stats[1].base_stat;
    const img = pokemon.sprites.front_default;
    const types = pokemon.types;

    const getWeaknesses = (name: string) => {
      return TYPE_WEAKNESSES[name];
    };

    if (
      searchState.length > 0 &&
      !pokemon.name.toLowerCase().includes(searchState.toLowerCase())
    ) {
      return null;
    }

    const typeList = types.map((type: { type: { name: string } }) => {
      return type.type.name;
    });

    if (
      typesFilter.length > 0 &&
      !typesFilter.every((item) => typeList.includes(item))
    ) {
      return null;
    }

    return (
      <div
        className={twMerge(
          clsx(
            "w-80 bg-neutral text-white rounded-box p-4 ring-4 ring-base-100 transition-all hover:scale-105",
            className
          )
        )}
        onClick={() =>
          callback?.({ id: pokemon.id, name: pokemon.name, img, hp, attack })
        }
      >
        <div className="flex items-baseline gap-2">
          <h3 className="!text-sm">
            #<span className="text-primary">{pokemon.id}</span>
          </h3>
          <h3 className="!text-xs capitalize">{pokemon.name}</h3>
        </div>
        <div className="flex py-4 h-[150px] justify-between">
          <div>
            {img ? (
              <Image
                src={img}
                alt={`${pokemon.name}`}
                width={100}
                height={100}
              />
            ) : (
              <h4>No Image</h4>
            )}
          </div>
          <div className="flex">
            <div className="divider divider-horizontal"></div>
            <div className="text-xs space-y-2">
              <h4>
                Hp: <span className="text-info">{hp}</span>
              </h4>
              <h4>
                Atk: <span className="text-error">{attack}</span>
              </h4>
              <h4>Weakness:</h4>
              <div className="flex flex-col gap-2">
                {types.map((type: { type: { name: string } }, key: number) => (
                  <div
                    className={`badge badge-sm p-2 text-white`}
                    style={{
                      backgroundColor:
                        TYPE_COLORS[getWeaknesses(type.type.name)],
                    }}
                    key={key}
                  >
                    <div>{getWeaknesses(type.type.name)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs">
          <h4>Types:</h4>
          <div className="flex gap-2 pt-2">
            {types.map((type: { type: { name: string } }, key: number) => (
              <div
                className={`badge badge-sm p-2 text-white`}
                style={{
                  backgroundColor: TYPE_COLORS[type.type.name],
                }}
                key={key}
              >
                {type.type.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default PokeCard;
