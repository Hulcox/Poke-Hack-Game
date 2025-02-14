import { useAnimateHp } from "@/hooks/useAnimation";
import { PokemonFormSchema } from "@/lib/types";
import clsx from "clsx";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import HpBar from "./hpBar";
import PokemonWithBase from "./pokemonWithBase";

interface FightBoxProps {
  pokemon: PokemonFormSchema;
  isAttacker?: boolean;
  isAttackerTurn: boolean;
  onSwitch?: () => void;
  onAttack: () => void;
  openPokemonMenu: () => void;
}

const FightBox = ({
  pokemon,
  isAttacker = false,
  isAttackerTurn,
  onSwitch,
  onAttack,
  openPokemonMenu,
}: FightBoxProps) => {
  const { displayHp, animateHpDecrease, setDisplayHp } = useAnimateHp(
    pokemon.hp
  );

  useEffect(() => {
    if (displayHp > pokemon.hp) {
      animateHpDecrease(pokemon.hp).then(() => {
        if (pokemon.hp === 0) {
          if (isAttacker) {
            openPokemonMenu();
          } else if (onSwitch) {
            onSwitch();
          }
        } else if (!isAttacker) {
          console.log("Attaquant suivant");
          onAttack();
        }
      });
    } else if (!isAttacker && displayHp === 0) {
      onAttack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon.hp]);

  useEffect(() => {
    setDisplayHp(pokemon.hp);
    if (isAttacker && !isAttackerTurn) {
      onAttack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon.name]);

  return (
    <div
      className={twMerge(
        clsx(
          "relative h-full w-1/2 flex flex-col justify-end items-center",
          !isAttacker && "h-[80%]"
        )
      )}
    >
      <HpBar hp={displayHp} hp_base={pokemon.hp_base} name={pokemon.name} />
      <PokemonWithBase
        img={isAttacker ? pokemon.img_back : pokemon.img}
        name={pokemon.name}
      />
    </div>
  );
};

export default FightBox;
