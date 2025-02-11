"use client";

import ErrorText from "@/components/error";
import Header from "@/components/header";
import Loading from "@/components/loading";
import TeamList from "@/components/team/teamList";
import { useTeamAll } from "@/hooks/useTeam";
import { useMutation } from "@tanstack/react-query";
import { Cat } from "lucide-react";
import { useRouter } from "next/navigation";

const deleteTeam = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/team/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  return await response.json();
};

const TeamPage = () => {
  const { teams, isSuccess, isLoading, refetch } = useTeamAll();

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      refetch();
    },
  });

  const goToCreatePage = () => {
    router.push("/teams/create");
  };

  const noTeam = teams?.status == 404;

  return (
    <div className="w-full h-dvh p-8">
      <div className="bg-base-100 rounded-box ring-4 ring-neutral p-4 h-full">
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
            active={isSuccess && noTeam}
            className="text-center"
          />
          <Loading
            size="lg"
            type="spinner"
            className="text-primary text-center"
            active={isLoading}
          />
          {isSuccess && teams?.length > 0 && (
            <TeamList
              teams={teams}
              onDelete={mutation.mutate}
              onUpdate={router.push}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
