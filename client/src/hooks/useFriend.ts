import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useFriendAll = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: () =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/friend/all`, {
        credential: true,
      }),
    retry: 0,
  });

  return { data, isError, isLoading };
};
