import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useTypes = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["types"],
    queryFn: () => api(`${process.env.NEXT_PUBLIC_POKEAPI_URL}/type`),
    retry: 0,
  });

  return { data, isError, isLoading };
};
