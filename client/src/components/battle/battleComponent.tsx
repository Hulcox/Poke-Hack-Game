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
  const [defenderTeam, setDefenderTeam] = useState(battle.defenderTeam);

  const [activeAttackerPokemon, setActiveAttackerPokemon] = useState(
    battle.activeAttackerPokemon
  );
  const [activeDefenderPokemon, setActiveDefenderPokemon] = useState(
    battle.activeDefenderPokemon
  );

  const [dialog, setDialog] = useState(
    "C'est au tour de Charizard de Romain d'attaquer !!"
  );

  const testFn = ({ by, type }: { by: string; type: string }) => {
    if (type == "SWITCH") {
      return api(`${process.env.NEXT_PUBLIC_API_URL}/battle/switch`, {
        method: "POST",
        data: {
          id: battle.id,
          by: by,
          type: type,
          from:
            by == "ATTACKER" ? activeAttackerPokemon : activeDefenderPokemon,
          to:
            by == "ATTACKER"
              ? attackerTeam[
                  attackerTeam.findIndex(
                    (elm) => elm.id == activeAttackerPokemon.id
                  ) + 1
                ]
              : defenderTeam[
                  defenderTeam.findIndex(
                    (elm) => elm.id == activeDefenderPokemon.id
                  ) + 1
                ],
        },
        credential: true,
      });
    } else {
      return api(`${process.env.NEXT_PUBLIC_API_URL}/battle/attack`, {
        method: "POST",
        data: {
          id: battle.id,
          by: by,
          type: type,
          from:
            by == "ATTACKER" ? activeAttackerPokemon : activeDefenderPokemon,
          to: by == "ATTACKER" ? activeDefenderPokemon : activeAttackerPokemon,
        },
        credential: true,
      });
    }
  };

  const move = useMutation({
    mutationFn: ({ by, type }: { by: string; type: string }) =>
      testFn({ by, type }),
    onSuccess: (data) => {
      console.log(data);
      setActiveAttackerPokemon(data.activeAttackerPokemon);
      setAttackerTeam(data.attackerTeam);
      setActiveDefenderPokemon(data.activeDefenderPokemon);
      setDefenderTeam(data.defenderTeam);
    },
  });

  const attackFn = (by: string) => {
    const isAttacker = by === "ATTACKER";
    const dialogText = `${
      isAttacker ? activeAttackerPokemon.name : activeDefenderPokemon.name
    } de ${
      isAttacker ? battle.attacker.username : battle.defender.username
    } attaque`;
    animateDialog(by, dialogText).then(() => {
      move.mutate({ by: by, type: "ATTACK" });
    });
  };

  const switchFn = (by: string) => {
    const isAttacker = by === "ATTACKER";

    const dialogText = `${
      isAttacker ? activeAttackerPokemon.name : activeDefenderPokemon.name
    } de ${
      isAttacker ? battle.attacker.username : battle.defender.username
    } est mort au combat`;

    const dialogText2 = `${
      isAttacker ? attackerTeam[1].name : defenderTeam[1].name
    } entre au combat`;
    animateDialog(by, dialogText).then(() => {
      animateDialog(by, dialogText2).then(() => {
        move.mutate({ by: by, type: "SWITCH" });
      });
    });
  };

  const animateDialog = (by: string, dialog: string) => {
    setDialog("");

    return new Promise<void>((resolve) => {
      const startAnimation = () => {
        const interval = setInterval(() => {
          setDialog((prev) => {
            if (prev === dialog) {
              clearInterval(interval);
              resolve();
              return dialog;
            }
            return dialog.slice(0, prev.length + 1);
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
        <FightBox
          pokemon={activeDefenderPokemon}
          onAttack={attackFn}
          onSwitch={switchFn}
        />
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
