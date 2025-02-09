"use client";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";

const getTypes = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_POKEAPI_URL}/type`);
  return await response.json();
};

const TypesFilter = ({
  typesState,
  setTypesState,
}: {
  typesState: string[];
  setTypesState: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { data } = useQuery({ queryKey: ["types"], queryFn: getTypes });
  const handleUpdateTypesState = (value: string) => {
    if (typesState.includes(value)) {
      setTypesState((prev) => [...prev.filter((name) => name != value)]);
    } else {
      setTypesState((prev) => [...prev, value]);
    }
  };
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        Filter <SlidersHorizontal />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content menu bg-neutral ring-2 ring-primary rounded-box z-[1] w-96 p-2 shadow"
      >
        {data && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm mb-2">Types:</h4>
              <div className="flex flex-row flex-wrap gap-2 justify-start">
                {data.results.map((type: { name: string }, key: number) => (
                  <div key={key} className="flex gap-2 items-center flex-1">
                    <input
                      type="checkbox"
                      checked={typesState.includes(type.name)}
                      onChange={() => handleUpdateTypesState(type.name)}
                      className="checkbox checkbox-warning"
                    />
                    {type.name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm my-2">HP:</h4>
              <input
                type="range"
                min={0}
                max="100"
                className="range range-info"
              />
            </div>
            <div>
              <h4 className="text-sm my-2">Attack:</h4>
              <input
                type="range"
                min={0}
                max="100"
                className="range range-error"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypesFilter;
