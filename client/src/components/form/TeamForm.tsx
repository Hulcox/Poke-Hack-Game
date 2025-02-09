"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import InputForm from "./inputForm";
import BtnForm from "./btnForm";

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
  btnLabel,
  nameField,
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
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: { team: [] },
  });

  const router = useRouter();

  const requestTeam = async (data: Inputs) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/team${isUpdate ? "/" + idTeam : ""}`,
      {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }
    return result;
  };

  const mutation = useMutation({
    mutationFn: requestTeam,
    onSuccess: () => {
      router.push("/teams");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (nameField) {
      setValue("name", nameField);
    }
  }, [nameField, setValue]);

  useEffect(() => {
    reset({ team: pokemonListState });
  }, [pokemonListState, reset]);

  const removePokemon = (id: number) => {
    setPokemonListState((prev) => prev.filter((pokemon) => pokemon.id !== id));
  };

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
            <div
              key={key}
              className="w-44 h-44 ring-2 ring-primary bg-neutral rounded-box p-8 flex flex-col items-center justify-center indicator"
            >
              <span
                className="indicator-item rounded-full bg-primary w-6 h-6 text-white flex item-center justify-center cursor-pointer"
                onClick={() => removePokemon(pokemon.id)}
              >
                <X />
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="!text-sm">
                  #<span className="text-primary">{pokemon.id}</span>
                </h3>
                <h3 className="!text-xs capitalize">{pokemon.name}</h3>
              </div>
              <Image
                src={pokemon.img}
                alt="pokemon teams img"
                width={150}
                height={150}
              />
              <div className="flex items-baseline gap-4">
                <h3 className="!text-xs flex">
                  Hp: <span className="text-info">{pokemon.hp}</span>
                </h3>
                <h3 className="!text-xs flex">
                  Atk: <span className="text-error">{pokemon.attack}</span>
                </h3>
              </div>
            </div>
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
