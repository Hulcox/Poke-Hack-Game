import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const usePokemon = (url: string) => {
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: [url],
    queryFn: () => api(url),
    retry: 0,
  });
  return { pokemon: data, isError, isLoading, isSuccess };
};

export const usePokedex = () => {
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["pokedex"],
    queryFn: () =>
      api(`${process.env.NEXT_PUBLIC_POKEAPI_URL}/pokemon?limit=151&offset=0`),
    retry: 0,
  });
  return { pokedex: data, isError, isLoading, isSuccess };
};
