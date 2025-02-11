import { PokemonFormSchema } from "@/lib/types";
import PokemonBullet from "../pokemon/pokemonBullet";

interface TeamInfoProps {
  pokemons: PokemonFormSchema[];
  totalHp: number;
}

const TeamInfo = ({ pokemons, totalHp }: TeamInfoProps) => {
  return (
    <>
      <div className="flex items-center gap-4">
        {pokemons.map(({ img }, key) => (
          <PokemonBullet key={key} img={img} />
        ))}
      </div>
      <h4>
        Total Hp: <span className="text-info">{totalHp}</span>
      </h4>
    </>
  );
};

export default TeamInfo;
