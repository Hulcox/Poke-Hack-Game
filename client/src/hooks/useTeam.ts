import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useTeamAll = () => {
  const { data, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["teams"],
    queryFn: () =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/team/all`, {
        credential: true,
      }),
    retry: 0,
  });

  return { teams: data, isLoading, isError, isSuccess, refetch };
};

export const useTeam = (id: string) => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["team", id],
    queryFn: () =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/team/${id}`, {
        credential: true,
      }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { team: data, isLoading, isError, isSuccess };
};
