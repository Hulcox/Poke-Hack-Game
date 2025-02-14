import { useAnimateDialog } from "@/hooks/useAnimation";
import { Battle, PokemonFormSchema, Weather } from "@/lib/types";
import { api } from "@/utils/api";
import {
  typeStrengthByWeather,
  typeWeaknessesByWeather,
} from "@/utils/pokemonTypes";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import WeatherBadge from "../weather/weatherBadge";
import FightBox from "./fight/fightBox";
import FightFooter from "./fight/fightFooter";
import PokemonMenu from "./fight/pokemonMenu";

interface BattleComponentProps {
  battle: Battle;
  weather: Weather;
}

const BattleComponent = ({ battle, weather }: BattleComponentProps) => {
  const [currentTurn, setCurrentTurn] = useState("ATTACKER");
  const [attackerTeam, setAttackerTeam] = useState(battle.attackerTeam);
  const [defenderTeam, setDefenderTeam] = useState(battle.defenderTeam);
  const [strengthType] = useState(typeStrengthByWeather(weather));
  const [weakType] = useState(typeWeaknessesByWeather(weather));

  const [activeAttackerPokemon, setActiveAttackerPokemon] = useState(
    battle.activeAttackerPokemon
  );
  const [activeDefenderPokemon, setActiveDefenderPokemon] = useState(
    battle.activeDefenderPokemon
  );

  const openPokemonMenu = () => {
    (document.getElementById("pokemonMenu") as HTMLDialogElement)?.showModal();
  };

  const { dialog, animateDialog } = useAnimateDialog(
    `C'est au tour de ${activeAttackerPokemon.name} de  ${battle.attacker.username} d'attaquer !!`
  );

  const getNextPokemon = (
    team: PokemonFormSchema[],
    activePokemon: PokemonFormSchema
  ) => {
    return team[team.findIndex((elm) => elm.id == activePokemon.id) + 1];
  };

  const move = useMutation({
    mutationFn: ({
      by,
      type,
      from,
      to,
    }: {
      by: string;
      type: string;
      from: PokemonFormSchema;
      to: PokemonFormSchema;
    }) =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/battle/${type.toLowerCase()}`, {
        method: "POST",
        data: {
          id: battle.id,
          by: by,
          type: type,
          from: from,
          to: to,
          strengthType: strengthType,
          weakType: weakType,
        },
        credential: true,
      }),
    onSuccess: async (data) => {
      console.log(data);

      if (data.valueEfficaity) {
        await animateDialog(
          currentTurn,
          `L'attaque est ${data.valueEfficaity}`
        );
      }

      setActiveAttackerPokemon(data.activeAttackerPokemon);
      setAttackerTeam(data.attackerTeam);
      setActiveDefenderPokemon(data.activeDefenderPokemon);
      setDefenderTeam(data.defenderTeam);
      setCurrentTurn(data.currentTurn);
    },
  });

  const attackFn = (
    by: string,
    from: PokemonFormSchema,
    to: PokemonFormSchema
  ) => {
    const isAttacker = by === "ATTACKER";

    const dialogText = `${
      isAttacker ? activeAttackerPokemon.name : activeDefenderPokemon.name
    } de ${
      isAttacker ? battle.attacker.username : battle.defender.username
    } attaque`;

    if (isAttacker && from.hp == 0) {
      const text = "Ton pokemon est mort il faut que tu change de pokemon.";
      return animateDialog(by, text).then(() => {
        openPokemonMenu();
      });
    }

    animateDialog(by, dialogText).then(() => {
      move.mutate({ by: by, type: "ATTACK", from, to });
    });
  };

  const switchFn = (
    by: string,
    from: PokemonFormSchema,
    to: PokemonFormSchema
  ) => {
    const isAttacker = by === "ATTACKER";

    let text = "";

    if (from.hp == 0) {
      text = `${from.name} de ${
        isAttacker ? battle.attacker.username : battle.defender.username
      } est KO !`;
    } else {
      text = `${from.name} laisse ça place à ${to.name}`;
    }

    animateDialog(by, text).then(() => {
      const text = `${to.name} entre au combat`;

      animateDialog(by, text).then(() => {
        move.mutate({
          by: by,
          type: "SWITCH",
          from: from,
          to: to,
        });
      });
    });
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between ">
      <div className="fixed top-5 left-5">
        <WeatherBadge weather={weather} />
      </div>
      <div className="h-3/4 flex p-8">
        <FightBox
          pokemon={activeAttackerPokemon}
          isAttacker
          isAttackerTurn={currentTurn === "ATTACKER"}
          onAttack={() =>
            attackFn("DEFENDER", activeDefenderPokemon, activeAttackerPokemon)
          }
          openPokemonMenu={openPokemonMenu}
        />
        <FightBox
          pokemon={activeDefenderPokemon}
          onAttack={() =>
            attackFn("DEFENDER", activeDefenderPokemon, activeAttackerPokemon)
          }
          isAttackerTurn={currentTurn === "ATTACKER"}
          onSwitch={() =>
            switchFn(
              "DEFENDER",
              activeDefenderPokemon,
              getNextPokemon(defenderTeam, activeDefenderPokemon)
            )
          }
          openPokemonMenu={openPokemonMenu}
        />
      </div>
      <FightFooter
        onAttack={() =>
          attackFn("ATTACKER", activeAttackerPokemon, activeDefenderPokemon)
        }
        dialog={dialog}
        openPokemonMenu={openPokemonMenu}
        currentTrun={currentTurn === "ATTACKER"}
      />
      <PokemonMenu
        pokemons={attackerTeam}
        activePokemon={activeAttackerPokemon}
        onSwitch={switchFn}
      />
    </div>
  );
};

export default BattleComponent;
