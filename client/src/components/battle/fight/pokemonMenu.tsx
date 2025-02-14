import PokemonBullet from "@/components/pokemon/pokemonBullet";
import { PokemonFormSchema } from "@/lib/types";
import HpBar from "./hpBar";

interface PokemonMenuProps {
  pokemons: PokemonFormSchema[];
  activePokemon: PokemonFormSchema;
  onSwitch: (
    by: string,
    from: PokemonFormSchema,
    to: PokemonFormSchema
  ) => void;
}
const PokemonMenu = ({
  pokemons,
  activePokemon,
  onSwitch,
}: PokemonMenuProps) => {
  const closePokemonMenu = () => {
    (document.getElementById("pokemonMenu") as HTMLDialogElement)?.close();
  };
  const handleSwitch = (pokemon: PokemonFormSchema) => {
    if (activePokemon.id == pokemon.id) {
      return;
    }
    onSwitch("ATTACKER", activePokemon, pokemon);
    closePokemonMenu();
  };

  return (
    <dialog id="pokemonMenu" className="modal">
      <div className="modal-box space-y-8">
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
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default PokemonMenu;
