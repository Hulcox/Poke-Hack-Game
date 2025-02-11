"use client";
import { PokemonFormSchema } from "@/lib/types";
import { useState } from "react";
import TeamForm from "../form/TeamForm";
import PokeCardList from "../pokemon/pokemonCardList";

interface TeamCreateAndUpdateProps {
  isUpdate?: boolean;
  team?: PokemonFormSchema[];
  teamName?: string;
  teamId?: string;
}

const TeamCreateAndUpdate = ({
  isUpdate,
  team,
  teamName,
  teamId,
}: TeamCreateAndUpdateProps) => {
  const [selectedPokemonsState, setSelectedPokemonsState] = useState(
    (isUpdate ? team : []) as PokemonFormSchema[]
  );

  return (
    <>
      <div className="w-full bg-base-100 rounded-box ring-4 ring-neutral p-4 sticky top-3 z-10">
        <TeamForm
          pokemonListState={selectedPokemonsState}
          setPokemonListState={setSelectedPokemonsState}
          btnLabel={isUpdate ? "Update team" : "Create team"}
          nameField={teamName}
          idTeam={teamId}
          isUpdate={isUpdate}
        />
      </div>
      <div className="w-full bg-base-100 flex-1 rounded-box ring-4 ring-neutral p-8">
        <div className="flex flex-row flex-wrap justify-center gap-8">
          <PokeCardList
            selectedPokemons={selectedPokemonsState}
            setSelectedPokemons={setSelectedPokemonsState}
          />
        </div>
      </div>
    </>
  );
};

export default TeamCreateAndUpdate;
