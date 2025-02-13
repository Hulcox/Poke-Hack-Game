import PokemonBullet from "@/components/pokemon/pokemonBullet";
import { PokemonFormSchema } from "@/lib/types";
import HpBar from "./hpBar";

interface PokemonMenuProps {
  pokemons: PokemonFormSchema[];
  activePokemon: PokemonFormSchema;
}
const PokemonMenu = ({ pokemons, activePokemon }: PokemonMenuProps) => {
  return (
    <dialog id="pokemonMenu" className="modal">
      <div className="modal-box space-y-8">
        <h2>Switch with</h2>
        <ul className="space-y-8">
          {pokemons?.map((pokemon, key: number) => (
            <li
              key={key}
              className={`flex items-center justify-between ${
                activePokemon.id == pokemon.id
                  ? "opacity-30 cursor-not-allowed"
                  : "cursor-pointer hover:scale-105"
              }`}
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
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default PokemonMenu;
