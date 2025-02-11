import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useFriendAll = () =>
  useQuery({
    queryKey: ["friends"],
    queryFn: () =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/friend/all`, {
        credential: true,
      }),
    retry: 0,
  });
