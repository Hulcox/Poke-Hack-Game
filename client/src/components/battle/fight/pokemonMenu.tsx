import Modal from "@/components/modal";
import PokemonBullet from "@/components/pokemon/pokemonBullet";
import { PokemonFormSchema } from "@/lib/types";
import HpBar from "./hpBar";

interface PokemonMenuProps {
  id: string;
  pokemons: PokemonFormSchema[];
  activePokemon: PokemonFormSchema;
  onSwitch: (
    by: string,
    from: PokemonFormSchema,
    to: PokemonFormSchema
  ) => void;
}
const PokemonMenu = ({
  id,
  pokemons,
  activePokemon,
  onSwitch,
}: PokemonMenuProps) => {
  const closePokemonMenu = () => {
    (document.getElementById(id) as HTMLDialogElement)?.close();
  };

  const handleSwitch = (pokemon: PokemonFormSchema) => {
    if (activePokemon.id == pokemon.id) {
      return;
    }
    onSwitch("ATTACKER", activePokemon, pokemon);
    closePokemonMenu();
  };

  return (
    <Modal id={id} className="space-y-8" withClose>
      <h2>Switch with</h2>
      <ul className="space-y-8">
        {pokemons?.map((pokemon, key: number) => (
          <li
            key={key}
            className={`flex items-center justify-between ${
              activePokemon.id == pokemon.id || pokemon.hp == 0
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer hover:scale-105"
            }`}
            onClick={() => handleSwitch(pokemon)}
          >
            <PokemonBullet img={pokemon.img} />
            <HpBar
              hp={pokemon.hp}
              hp_base={pokemon.hp_base}
              name={pokemon.name}
            />
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default PokemonMenu;
