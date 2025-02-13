import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

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
