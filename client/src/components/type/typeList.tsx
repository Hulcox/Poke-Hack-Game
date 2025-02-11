import { TYPE_WEAKNESSES } from "@/utils/pokemonTypes";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import TypeBadge from "./typeBadge";

const TypeList = ({
  name,
  types,
  isWeakness = false,
  className,
  titleClassName,
}: {
  name: string;
  types: string[];
  isWeakness?: boolean;
  className?: string;
  titleClassName?: string;
}) => {
  return (
    <>
      <h4 className={titleClassName}>{name}</h4>
      <div className={twMerge(clsx("flex gap-2", className))}>
        {types.map((type: string, key: number) => (
          <TypeBadge
            key={key}
            type={isWeakness ? TYPE_WEAKNESSES[type] : type}
          />
        ))}
      </div>
    </>
  );
};

export default TypeList;
