"use client";

import { usePokemon } from "@/hooks/usePokemon";
import { PokeCardProps, PokemonFormSchema } from "@/lib/types";
import clsx from "clsx";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import ErrorText from "../error";
import Loading from "../loading";
import TypeList from "../type/typeList";

export interface PokemonCardProps {
  url: string;
  searchState: string;
  typesFilter: string[];
  className?: string;
  callback?: (data: PokemonFormSchema) => void;
}

const PokemonCard = ({
  url,
  searchState,
  typesFilter,
  className,
  callback,
}: PokeCardProps) => {
  const { pokemon, isError, isLoading } = usePokemon(url);

  if (isLoading) {
    return (
      <Loading
        size="lg"
        type="spinner"
        className={clsx(
          "w-80 h-72 bg-neutral text-white rounded-box p-4 ring-4 ring-base-100 flex items-center justify-center opacity-75",
          className
        )}
        active
      />
    );
  }

  if (isError || !pokemon) {
    return (
      <ErrorText
        title={"Doesn't exist"}
        className={clsx(
          "w-80 h-72 bg-neutral text-white rounded-box p-4 ring-4 ring-base-100 flex items-center justify-center",
          className
        )}
        active
      />
    );
  }

  const { id, name, stats, sprites, types } = pokemon;
  const hp = stats[0].base_stat;
  const attack = stats[1].base_stat;
  const img = sprites.front_default;
  const img_back = sprites.back_default;

  const typeList = types.map(
    ({ type }: { type: { name: string } }) => type.name
  );

  if (searchState && !name.toLowerCase().includes(searchState.toLowerCase())) {
    return null;
  }

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
      onClick={() => callback?.({ id, name, img, img_back, hp, attack })}
    >
      <div className="flex items-baseline gap-2">
        <h3 className="!text-sm">
          #<span className="text-primary">{id}</span>
        </h3>
        <h3 className="!text-xs capitalize">{name}</h3>
      </div>
      <div className="flex py-4 h-[150px] justify-between">
        {img ? (
          <Image src={img} alt={name} width={100} height={100} />
        ) : (
          <h4>No Image</h4>
        )}
        <div className="flex">
          <div className="divider divider-horizontal"></div>
          <div className="text-xs space-y-2">
            <h4>
              Hp: <span className="text-info">{hp}</span>
            </h4>
            <h4>
              Atk: <span className="text-error">{attack}</span>
            </h4>
            <TypeList
              name="Weakness:"
              types={typeList}
              isWeakness
              className="flex-col"
            />
          </div>
        </div>
      </div>
      <div className="text-xs">
        <TypeList name="Types:" types={typeList} className="pt-2" />
      </div>
    </div>
  );
};

export default PokemonCard;
