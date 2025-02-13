import { PokemonFormSchema } from "@/lib/types";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import HpBar from "./hpBar";
import PokemonWithBase from "./pokemonWithBase";

interface FightBoxProps {
  pokemon: PokemonFormSchema;
  isAttack?: boolean;
  onAttack?: (by: string) => void;
}

const FightBox = ({ pokemon, isAttack, onAttack }: FightBoxProps) => {
  const [displayHp, setDisplayHp] = useState(pokemon.hp);

  const animateHpDecrease = (targetHp: number) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setDisplayHp((prev) => {
          console.log("-1");
          if (prev <= targetHp) {
            clearInterval(interval);
            resolve();
            return targetHp;
          }
          return prev - 1;
        });
      }, 50);
    });
  };

  useEffect(() => {
    if (displayHp > pokemon.hp) {
      animateHpDecrease(pokemon.hp).then(() => {
        console.log("Mise à jour terminée !");
        if (pokemon.hp === 0) {
          console.log("pokemon is dead");
        } else if (pokemon.hp >= 0 && !isAttack && onAttack) {
          console.log("attacker suivante");
          onAttack("DEFENDER");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon.hp]);

  return (
    <div
      className={twMerge(
        clsx(
          "relative h-full w-1/2  flex flex-col justify-end items-center",
          !isAttack && "h-[80%]"
        )
      )}
    >
      <HpBar hp={displayHp} hp_base={pokemon.hp_base} name={pokemon.name} />
      <PokemonWithBase
        img={isAttack ? pokemon.img_back : pokemon.img}
        name={pokemon.name}
      />
    </div>
  );
};

export default FightBox;
