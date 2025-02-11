"use client";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import PokemonPreview from "../pokemon/pokemonPreview";
import BtnForm from "./btnForm";
import InputForm from "./inputForm";

const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  img: z.string(),
  hp: z.number(),
  attack: z.number(),
});

const schema = z.object({
  name: z.string().nonempty("Name team is required"),
  team: z
    .array(pokemonSchema)
    .max(6, "You can only have up to 6 Pokémons")
    .min(6, "6 pokémons is required in your team"),
});

type Inputs = z.infer<typeof schema>;
type Pokemon = z.infer<typeof pokemonSchema>;

const TeamForm = ({
  pokemonListState,
  setPokemonListState,
  nameField,
  btnLabel,
  idTeam,
  isUpdate = false,
}: {
  pokemonListState: Pokemon[];
  setPokemonListState: React.Dispatch<React.SetStateAction<Pokemon[]>>;
  nameField?: string;
  btnLabel: string;
  idTeam?: string;
  isUpdate?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: { team: isUpdate ? pokemonListState : [], name: nameField },
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: Inputs) =>
      api(
        `${process.env.NEXT_PUBLIC_API_URL}/team${
          isUpdate ? "/" + idTeam : ""
        }`,
        { method: isUpdate ? "PUT" : "POST", data: data, credential: true }
      ),
    onSuccess: () => {
      router.push("/teams");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    reset({ team: pokemonListState });
  }, [pokemonListState, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full w-full gap-6"
    >
      <InputForm
        name={"name"}
        placeholder="Team name"
        type="text"
        register={register}
        error={errors.name}
        isRequired
        className="w-1/3"
      />
      <div className="flex flex-row flex-wrap justify-center items-center gap-8 min-h-44">
        {pokemonListState.length > 0 ? (
          pokemonListState.map((pokemon: Pokemon, key: number) => (
            <PokemonPreview
              key={key}
              pokemon={pokemon}
              setPokemonList={setPokemonListState}
            />
          ))
        ) : (
          <h2>Please select some Pokemon</h2>
        )}
      </div>
      {errors.team && (
        <p className="text-error text-center !text-xs mt-4">
          {errors.team.message}
        </p>
      )}
      <div className="w-full text-end">
        <BtnForm btnLabel={btnLabel} mutation={mutation} />
      </div>
    </form>
  );
};

export default TeamForm;
