"use client";

import BoxRoot from "@/components/boxRoot";
import ErrorText from "@/components/error";
import Header from "@/components/header";
import Loading from "@/components/loading";
import TeamList from "@/components/team/teamList";
import { useTeamAll } from "@/hooks/useTeam";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { Cat } from "lucide-react";
import { useRouter } from "next/navigation";

const TeamPage = () => {
  const { teams, isError, isSuccess, isLoading, refetch } = useTeamAll();

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (id: number) =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/team/${id}`, {
        method: "DELETE",
        credential: true,
      }),
    onSuccess: () => {
      refetch();
    },
  });

  const goToCreatePage = () => {
    router.push("/teams/create");
  };

  return (
    <BoxRoot>
      <Header
        title="My Teams"
        icon={<Cat />}
        action={
          <button className="btn btn-sm btn-primary" onClick={goToCreatePage}>
            Create a new team
          </button>
        }
      />
      <div className="mt-12">
        <ErrorText
          title={"You don't have team"}
          active={isError}
          className="text-center"
        />
        <Loading
          size="lg"
          type="spinner"
          className="text-primary text-center"
          active={isLoading}
        />
        {isSuccess && (
          <TeamList
            teams={teams}
            onDelete={mutation.mutate}
            onUpdate={router.push}
          />
        )}
      </div>
    </BoxRoot>
  );
};

export default TeamPage;
