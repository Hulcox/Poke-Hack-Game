import { useAnimateDialog } from "@/hooks/useAnimation";
import { Battle, PokemonFormSchema, Weather } from "@/lib/types";
import { api } from "@/utils/api";
import { dialogTemplates } from "@/utils/dialog";
import {
  typeStrengthByWeather,
  typeWeaknessesByWeather,
} from "@/utils/pokemonTypes";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import WeatherBadge from "../weather/weatherBadge";
import BattleEndMenu from "./battleEndMenu";
import FightBox from "./fight/fightBox";
import FightFooter from "./fight/fightFooter";
import PokemonMenu from "./fight/pokemonMenu";

interface BattleComponentProps {
  battle: Battle;
  weather: Weather;
}

const pokemonModalId = "pokemonMenu";
const battleEndId = "battleEnd";

const BattleComponent = ({ battle, weather }: BattleComponentProps) => {
  const [state, setState] = useState({
    currentTurn: "ATTACKER",
    attackerTeam: battle.attackerTeam,
    defenderTeam: battle.defenderTeam,
    activeAttackerPokemon: battle.activeAttackerPokemon,
    activeDefenderPokemon: battle.activeDefenderPokemon,
  });
  const [winner, setWinner] = useState("");

  const { dialog, animateDialog } = useAnimateDialog(
    dialogTemplates.attackerTurn(
      state.activeAttackerPokemon.name,
      battle.attacker.username
    )
  );

  const openPokemonMenu = () => {
    (document.getElementById(pokemonModalId) as HTMLDialogElement)?.showModal();
  };
  const openBattleEndMenu = () => {
    (document.getElementById(battleEndId) as HTMLDialogElement)?.showModal();
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
          by,
          type,
          from,
          to,
          strengthType: typeStrengthByWeather(weather),
          weakType: typeWeaknessesByWeather(weather),
        },
        credential: true,
      }),
    onSuccess: async (data) => {
      if (data.winner) {
        setWinner(data.winner);
        openBattleEndMenu();
        return;
      }

      if (data.valueEfficaity) {
        await animateDialog(
          state.currentTurn,
          `The Attack is ${data.valueEfficaity}`
        );
      }

      setState({
        currentTurn: data.currentTurn,
        attackerTeam: data.attackerTeam,
        defenderTeam: data.defenderTeam,
        activeAttackerPokemon: data.activeAttackerPokemon,
        activeDefenderPokemon: data.activeDefenderPokemon,
      });
    },
  });

  const attackFn = (
    by: string,
    from: PokemonFormSchema,
    to: PokemonFormSchema
  ) => {
    const isAttacker = by === "ATTACKER";
    if (isAttacker && from.hp === 0) {
      return animateDialog(by, dialogTemplates.fainted).then(openPokemonMenu);
    }
    animateDialog(
      by,
      dialogTemplates.attack(
        from.name,
        isAttacker ? battle.attacker.username : battle.defender.username
      )
    ).then(() => {
      move.mutate({ by, type: "ATTACK", from, to });
    });
  };

  const switchFn = (
    by: string,
    from: PokemonFormSchema,
    to: PokemonFormSchema
  ) => {
    const isAttacker = by === "ATTACKER";
    const text =
      from.hp === 0
        ? dialogTemplates.ko(
            from.name,
            isAttacker ? battle.attacker.username : battle.defender.username
          )
        : dialogTemplates.switch(from.name, to.name);

    animateDialog(by, text).then(() => {
      animateDialog(by, dialogTemplates.enterBattle(to.name)).then(() => {
        move.mutate({ by, type: "SWITCH", from, to });
      });
    });
  };

  const getNextPokemon = (
    team: PokemonFormSchema[],
    active: PokemonFormSchema
  ) => {
    return team[team.findIndex((elm) => elm.id == active.id) + 1];
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between ">
      <div className="fixed top-5 left-5">
        <WeatherBadge weather={weather} />
      </div>
      <div className="h-3/4 flex p-8">
        <FightBox
          pokemon={state.activeAttackerPokemon}
          isAttacker
          isAttackerTurn={state.currentTurn === "ATTACKER"}
          onAttack={() =>
            attackFn(
              "DEFENDER",
              state.activeDefenderPokemon,
              state.activeAttackerPokemon
            )
          }
          openPokemonMenu={openPokemonMenu}
        />
        <FightBox
          pokemon={state.activeDefenderPokemon}
          onAttack={() =>
            attackFn(
              "DEFENDER",
              state.activeDefenderPokemon,
              state.activeAttackerPokemon
            )
          }
          isAttackerTurn={state.currentTurn === "ATTACKER"}
          onSwitch={() =>
            switchFn(
              "DEFENDER",
              state.activeDefenderPokemon,
              getNextPokemon(state.defenderTeam, state.activeDefenderPokemon)
            )
          }
          openPokemonMenu={openPokemonMenu}
        />
      </div>
      <FightFooter
        onAttack={() =>
          attackFn(
            "ATTACKER",
            state.activeAttackerPokemon,
            state.activeDefenderPokemon
          )
        }
        dialog={dialog}
        openPokemonMenu={openPokemonMenu}
        currentTrun={state.currentTurn === "ATTACKER"}
      />
      <PokemonMenu
        id={pokemonModalId}
        pokemons={state.attackerTeam}
        activePokemon={state.activeAttackerPokemon}
        onSwitch={switchFn}
      />
      <BattleEndMenu id={battleEndId} win={winner === "ATTACKER"} />
    </div>
  );
};

export default BattleComponent;
