import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useHistory = () => {
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["history"],
    queryFn: () =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
        credential: true,
      }),
    retry: 0,
  });
  return { data, isError, isLoading, isSuccess };
};
