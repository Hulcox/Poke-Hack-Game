import { useAnimateDialog } from "@/hooks/useAnimation";
import { Battle, Hack, PokemonFormSchema, Weather } from "@/lib/types";
import { api } from "@/utils/api";
import { dialogTemplates } from "@/utils/dialog";
import {
  typeStrengthByWeather,
  typeWeaknessesByWeather,
} from "@/utils/pokemonTypes";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import WeatherBadge from "../weather/weatherBadge";
import BattleEndMenu from "./fight/battleEndMenu";
import FightBox from "./fight/fightBox";
import FightFooter from "./fight/fightFooter";
import HackMenu from "./fight/hackMenu";
import PokemonMenu from "./fight/pokemonMenu";

interface BattleComponentProps {
  battle: Battle;
  weather: Weather;
}

const pokemonModalId = "pokemonMenu";
const battleEndId = "battleEndMenu";
const hackMenu = "hackMeny";

const BattleComponent = ({ battle, weather }: BattleComponentProps) => {
  const [battleState, setBattleState] = useState({
    currentTurn: "ATTACKER",
    attackerTeam: battle.attackerTeam,
    defenderTeam: battle.defenderTeam,
    activeAttackerPokemon: battle.activeAttackerPokemon,
    activeDefenderPokemon: battle.activeDefenderPokemon,
  });
  const [status, setStatus] = useState("");
  const [hack, setHack] = useState<Hack | null>(null);

  const { dialog, animateDialog } = useAnimateDialog(
    dialogTemplates.attackerTurn(
      battleState.activeAttackerPokemon.name,
      battle.attacker.username
    )
  );

  const openPokemonMenu = () => {
    (document.getElementById(pokemonModalId) as HTMLDialogElement)?.showModal();
  };
  const openBattleEndMenu = () => {
    (document.getElementById(battleEndId) as HTMLDialogElement)?.showModal();
  };
  const openHackMenu = () => {
    (document.getElementById(hackMenu) as HTMLDialogElement)?.showModal();
  };

  const move = useMutation({
    mutationFn: ({
      by,
      hackDifficulty,
      type,
      from,
      to,
    }: {
      by?: string;
      hackDifficulty?: string;
      type: string;
      from?: PokemonFormSchema;
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
          hackDifficulty,
        },
        credential: true,
      }),
    onSuccess: async (data) => {
      if (data.status) {
        setStatus(data.status);
        openBattleEndMenu();
        return;
      }

      if (data.hack) {
        setHack(data.hack);
        openHackMenu();
        return;
      }

      if (data.attackEfficacy) {
        await animateDialog(
          battleState.currentTurn,
          `The Attack is ${data.attackEfficacy}`
        );
      }

      if (data.hackMessage) {
        await animateDialog(battleState.currentTurn, data.hackMessage);
      }

      setBattleState({
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

  const onHack = (difficulty: string) => {
    animateDialog("ATTACKER", dialogTemplates.hackNotResolve).then(() => {
      move.mutate({
        hackDifficulty: difficulty,
        type: "HACK",
        to: battleState.activeAttackerPokemon,
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
          pokemon={battleState.activeAttackerPokemon}
          isAttacker
          isAttackerTurn={battleState.currentTurn === "ATTACKER"}
          onAttack={() =>
            attackFn(
              "DEFENDER",
              battleState.activeDefenderPokemon,
              battleState.activeAttackerPokemon
            )
          }
          openPokemonMenu={openPokemonMenu}
        />
        <FightBox
          pokemon={battleState.activeDefenderPokemon}
          onAttack={() =>
            attackFn(
              "DEFENDER",
              battleState.activeDefenderPokemon,
              battleState.activeAttackerPokemon
            )
          }
          isAttackerTurn={battleState.currentTurn === "ATTACKER"}
          onSwitch={() =>
            switchFn(
              "DEFENDER",
              battleState.activeDefenderPokemon,
              getNextPokemon(
                battleState.defenderTeam,
                battleState.activeDefenderPokemon
              )
            )
          }
          openPokemonMenu={openPokemonMenu}
        />
      </div>
      <FightFooter
        onAttack={() =>
          attackFn(
            "ATTACKER",
            battleState.activeAttackerPokemon,
            battleState.activeDefenderPokemon
          )
        }
        dialog={dialog}
        openPokemonMenu={openPokemonMenu}
        currentTrun={battleState.currentTurn === "ATTACKER"}
      />
      <PokemonMenu
        id={pokemonModalId}
        pokemons={battleState.attackerTeam}
        activePokemon={battleState.activeAttackerPokemon}
        onSwitch={switchFn}
      />
      <BattleEndMenu id={battleEndId} win={status == "WIN"} />
      <HackMenu
        id={hackMenu}
        hack={hack}
        onHack={onHack}
        onAttack={() =>
          attackFn(
            "ATTACKER",
            battleState.activeAttackerPokemon,
            battleState.activeDefenderPokemon
          )
        }
      />
    </div>
  );
};

export default BattleComponent;
