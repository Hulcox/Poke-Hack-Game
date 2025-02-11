"use client";
import ErrorText from "@/components/error";
import Loading from "@/components/loading";
import TeamCreateAndUpdate from "@/components/team/teamCreateAndUpdate";
import { useTeam } from "@/hooks/useTeam";
import { useParams } from "next/navigation";

const UpdateTeamPage = () => {
  const { id } = useParams();

  const { team, isLoading, isError, isSuccess } = useTeam(`${id}`);

  return (
    <div className="flex flex-col gap-4 w-full bg-neutral-content p-4">
      <ErrorText
        title="Team not found"
        active={isError}
        className="text-center text-error"
      />
      <Loading
        size="lg"
        type="spinner"
        active={isLoading}
        className="text-primary text-center"
      />
      {isSuccess && (
        <TeamCreateAndUpdate
          team={team.pokemons}
          teamName={team.name}
          teamId={team.id}
          isUpdate
        />
      )}
    </div>
  );
};

export default UpdateTeamPage;
