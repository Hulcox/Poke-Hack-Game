import Image from "next/image";

interface PokemonWithBaseProps {
  img: string;
  name: string;
}

const PokemonWithBase = ({ img, name }: PokemonWithBaseProps) => {
  return (
    <>
      <Image
        src={img}
        alt={name}
        property="true"
        width={300}
        height={300}
        className="relative z-10"
        unoptimized={true}
      />
      <div className="rounded-[100%] bg-neutral shadow-lg shadow-base-300 w-full h-16 ring ring-[#58585A] absolute bottom-0 left-0"></div>
    </>
  );
};

export default PokemonWithBase;
