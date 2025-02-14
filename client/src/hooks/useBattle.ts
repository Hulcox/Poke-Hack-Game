import { Battle, PokemonFormSchema } from "@/lib/types";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useBattle = (id: string) =>
  useQuery({
    queryKey: ["battle", id],
    queryFn: () =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/battle/${id}`, {
        credential: true,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

export const useBattleState = (initialBattle: Battle) => {
  const [currentTurn, setCurrentTurn] = useState<"ATTACKER" | "DEFENDER">(
    "ATTACKER"
  );
  const [dialog, setDialog] = useState(
    `C'est au tour de ${initialBattle.attacker.username} avec ${initialBattle.activeAttackerPokemon.name} d'attaquer !`
  );
  const [players, setPlayers] = useState({
    ATTACKER: {
      active: initialBattle.activeAttackerPokemon,
      team: initialBattle.attackerTeam,
      username: initialBattle.attacker.username,
    },
    DEFENDER: {
      active: initialBattle.activeDefenderPokemon,
      team: initialBattle.defenderTeam,
      username: initialBattle.defender.username,
    },
  });

  const getNextPokemon = (player: "ATTACKER" | "DEFENDER") => {
    const currentIndex = players[player].team.findIndex(
      (pokemon: PokemonFormSchema) => pokemon.id === players[player].active.id
    );
    return players[player].team[currentIndex + 1] || null;
  };

  const updatePlayerState = (newState: Partial<typeof players>) => {
    setPlayers((prev) => ({ ...prev, ...newState }));
  };

  return {
    currentTurn,
    setCurrentTurn,
    dialog,
    setDialog,
    players,
    updatePlayerState,
    getNextPokemon,
  };
};
