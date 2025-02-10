import { TYPE_COLORS } from "@/utils/pokemonTypes";

const TypeBadge = ({ type }: { type: string }) => {
  return (
    <div
      className={`badge badge-sm p-2 text-white`}
      style={{
        backgroundColor: TYPE_COLORS[type],
      }}
    >
      <div>{type}</div>
    </div>
  );
};

export default TypeBadge;
