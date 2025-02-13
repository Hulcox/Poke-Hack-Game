import { Battle, Weather } from "@/lib/types";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import WeatherBadge from "../weather/weatherBadge";
import FightBox from "./fight/fightBox";
import FightFooter from "./fight/fightFooter";

interface BattleComponentProps {
  battle: Battle;
  weather: Weather;
}

const BattleComponent = ({ battle, weather }: BattleComponentProps) => {
  const [attackerTeam, setAttackerTeam] = useState(battle.attackerTeam);
  const [activeAttackerPokemon, setActiveAttackerPokemon] = useState(
    battle.activeAttackerPokemon
  );
  const [activeDefenderPokemon, setActiveDefenderPokemon] = useState(
    battle.activeDefenderPokemon
  );

  const [dialog, setDialog] = useState(
    "C'est au tour de Charizard de Romain d'attaquer !!"
  );

  const attack = useMutation({
    mutationFn: (by: string) =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/battle/attack`, {
        method: "POST",
        data: {
          id: battle.id,
          by: by,
          type: "ATTACK",
          from:
            by == "ATTACKER"
              ? battle.activeAttackerPokemon
              : battle.activeDefenderPokemon,
          to:
            by == "ATTACKER"
              ? battle.activeDefenderPokemon
              : battle.activeAttackerPokemon,
        },
        credential: true,
      }),
    onSuccess: (data) => {
      console.log(data);
      setActiveAttackerPokemon(data.activeAttackerPokemon);
      setAttackerTeam(data.attackerTeam);
      setActiveDefenderPokemon(data.activeDefenderPokemon);
    },
  });

  // const switchPoke = useMutation({
  //   mutationFn: (by: string) =>
  //     api(`${process.env.NEXT_PUBLIC_API_URL}/battle/switch`, {
  //       method: "POST",
  //       data: {
  //         id: battle.id,
  //         by: by,
  //         type: "SWITCH",
  //         from:
  //           by == "ATTACKER"
  //             ? battle.activeAttackerPokemon
  //             : battle.activeDefenderPokemon,
  //         to:
  //           by == "ATTACKER"
  //             ? battle.activeDefenderPokemon
  //             : battle.activeAttackerPokemon,
  //       },
  //       credential: true,
  //     }),
  //   onSuccess: (data) => {
  //     console.log(data);
  //     setActiveAttackerPokemon(data.activeAttackerPokemon);
  //     setActiveDefenderPokemon(data.activeDefenderPokemon);
  //   },
  // });

  const attackFn = (by: string) => {
    animateDialog(by).then(() => {
      attack.mutate(by);
    });
  };

  const animateDialog = (by: string) => {
    const isAttacker = by === "ATTACKER";
    const dialogText = `${
      isAttacker ? activeAttackerPokemon.name : activeDefenderPokemon.name
    } de ${
      isAttacker ? battle.attacker.username : battle.defender.username
    } attaque`;

    setDialog("");

    return new Promise<void>((resolve) => {
      const startAnimation = () => {
        const interval = setInterval(() => {
          setDialog((prev) => {
            if (prev === dialogText) {
              clearInterval(interval);
              resolve();
              return dialogText;
            }
            return dialogText.slice(0, prev.length + 1);
          });
        }, 70);
      };

      if (by === "DEFENDER") {
        setTimeout(startAnimation, 2000);
      } else {
        startAnimation();
      }
    });
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between ">
      <div className="fixed top-5 left-5">
        <WeatherBadge weather={weather} />
      </div>
      <div className="h-3/4 flex p-8">
        <FightBox pokemon={activeAttackerPokemon} isAttack />
        <FightBox pokemon={activeDefenderPokemon} onAttack={attackFn} />
      </div>
      <FightFooter
        onAttack={attackFn}
        dialog={dialog}
        pokemons={attackerTeam}
        activePokemon={activeAttackerPokemon}
      />
    </div>
  );
};

export default BattleComponent;
