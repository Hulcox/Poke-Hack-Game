import { useQuery } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import Image from "next/image";

const getPokemon = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

const PokemonBullet = ({ url }: { url: string }) => {
  const {
    data: pokemon,
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [url],
    queryFn: () => getPokemon(url),
  });

  if (isError) {
    return (
      <div className="ring-2 ring-primary rounded-full w-[75px] h-[75px]  flex items-center justify-center text-white">
        <Ban />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-full w-[75px] h-[75px] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isSuccess) {
    const img = pokemon.sprites.front_default;
    return (
      <div className="ring-2 ring-primary rounded-full">
        <Image
          src={img}
          alt="pokemon little size"
          width={75}
          height={75}
          className="mask mask-circle bg-neutral-content"
        />
      </div>
    );
  }
};

export default PokemonBullet;
