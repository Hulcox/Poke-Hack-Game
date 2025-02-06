"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const getPokemon = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/charizard");
  return await response.json();
};

const BoardGame = () => {
  const query = useQuery({ queryKey: ["test"], queryFn: getPokemon });
  console.log(query.data);

  return (
    query.data && (
      <div className="flex flex-row w-dvw h-dvh bg-gradient-to-t from-black to-white">
        <div className="flex-1 h-full flex flex-col justify-between ">
          <div className="h-3/4 flex p-8">
            <div className="relative h-full w-1/2  flex flex-col justify-end items-center">
              <div className="w-3/4 mb-4 text-white">
                <h2>Charizard</h2>
                <progress
                  className="progress progress-success ring"
                  value="100"
                  max="100"
                ></progress>
              </div>
              <Image
                src={query.data.sprites.back_default}
                alt="test"
                property="true"
                width={300}
                height={300}
                className="relative z-10"
              />
              <div className="rounded-[100%] bg-neutral shadow-lg shadow-base-300 w-full h-16 ring ring-[#58585A] absolute bottom-0 left-0"></div>
            </div>
            <div className="relative h-[80%] w-1/2  flex flex-col justify-end items-center">
              <div className="w-3/4 mb-4 text-white">
                <h2>Charizard</h2>
                <progress
                  className="progress progress-success ring"
                  value="100"
                  max="100"
                ></progress>
              </div>
              <Image
                src={query.data.sprites.front_default}
                alt="test"
                property="true"
                width={300}
                height={300}
                className="relative z-10"
              />
              <div className="rounded-[100%] bg-neutral shadow-lg shadow-base-300 w-full h-16 ring ring-[#58585A] absolute bottom-0 left-0"></div>
            </div>
          </div>
          <div className="w-full h-1/4 bg-base-300 rounded-t-lg border-neutral border-[4px] p-8 flex">
            <div className="w-3/4 p-8">
              {" "}
              C'est au tour de Charizard de Romain d'attaquer !!
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="1/4 flex flex-col justify-around">
              <div className="flex gap-8">
                <button className="btn btn-lg btn-error">Attack</button>
                <button className="btn btn-lg btn-success">Pokemon</button>
              </div>
              <button className="btn btn-neutral w-full">Give Up</button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BoardGame;
