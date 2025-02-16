import { useTeamAll } from "@/hooks/useTeam";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ErrorText from "../error";
import Loading from "../loading";
import TeamList from "./teamList";

interface TeamPreviewProps {
  className?: string;
  action?: boolean;
}

const TeamPreview = ({ className, action }: TeamPreviewProps) => {
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

  return (
    <div className={className}>
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
          {...(action && { onDelete: mutation.mutate })}
          {...(action && { onUpdate: router.push })}
        />
      )}
    </div>
  );
};

export default TeamPreview;
