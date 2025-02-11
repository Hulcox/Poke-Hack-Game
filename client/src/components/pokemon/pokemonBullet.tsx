import Image from "next/image";

const PokemonBullet = ({ img }: { img: string }) => {
  return (
    <div className="ring-2 ring-primary rounded-full">
      <Image
        src={img}
        alt="pokemon little size"
        width={75}
        height={75}
        className="mask mask-circle bg-neutral-content"
      />
    </div>
  );
};

export default PokemonBullet;
