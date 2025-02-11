import { PokemonFormSchema } from "@/lib/types";
import { X } from "lucide-react";
import Image from "next/image";

interface PokemonPreviewProps {
  pokemon: PokemonFormSchema;
  setPokemonList: React.Dispatch<React.SetStateAction<PokemonFormSchema[]>>;
}

const PokemonPreview = ({ pokemon, setPokemonList }: PokemonPreviewProps) => {
  const removePokemon = (id: number) =>
    setPokemonList((prev) => prev.filter((pokemon) => pokemon.id !== id));

  return (
    <div className="w-44 h-44 ring-2 ring-primary bg-neutral rounded-box p-8 flex flex-col items-center justify-center indicator">
      <span
        className="indicator-item rounded-full bg-primary w-6 h-6 text-white flex item-center justify-center cursor-pointer"
        onClick={() => removePokemon(pokemon.id)}
      >
        <X />
      </span>
      <div className="flex items-baseline gap-2">
        <h3 className="!text-sm">
          #<span className="text-primary">{pokemon.id}</span>
        </h3>
        <h3 className="!text-xs capitalize">{pokemon.name}</h3>
      </div>
      <Image
        src={pokemon.img}
        alt="pokemon teams img"
        width={150}
        height={150}
      />
      <div className="flex items-baseline gap-4">
        <h3 className="!text-xs flex">
          Hp: <span className="text-info">{pokemon.hp}</span>
        </h3>
        <h3 className="!text-xs flex">
          Atk: <span className="text-error">{pokemon.attack}</span>
        </h3>
      </div>
    </div>
  );
};

export default PokemonPreview;
