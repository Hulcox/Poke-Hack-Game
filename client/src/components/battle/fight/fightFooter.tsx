import { PokemonFormSchema } from "@/lib/types";
import PokemonMenu from "./pokemonMenu";

interface FightFooterProps {
  pokemons: PokemonFormSchema[];
  activePokemon: PokemonFormSchema;
  dialog: string;
  onAttack: (type: string) => void;
}

const FightFooter = ({
  pokemons,
  activePokemon,
  dialog,
  onAttack,
}: FightFooterProps) => {
  const openPokemonMenu = () => {
    (document.getElementById("pokemonMenu") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="w-full h-1/4 bg-base-300 rounded-t-lg border-neutral border-[4px] p-8 flex">
      <div className="w-3/4 p-8">{dialog}</div>
      <div className="divider divider-horizontal"></div>
      <div className="1/4 flex flex-col justify-around">
        <div className="flex gap-8">
          <button
            className="btn btn-lg btn-error"
            onClick={() => onAttack("ATTACKER")}
          >
            Attack
          </button>
          <button className="btn btn-lg btn-success" onClick={openPokemonMenu}>
            Pokemon
          </button>
        </div>
        <button className="btn btn-neutral w-full">Give Up</button>
      </div>
      <PokemonMenu pokemons={pokemons} activePokemon={activePokemon} />
    </div>
  );
};

export default FightFooter;
