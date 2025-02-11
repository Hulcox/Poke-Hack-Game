"use client";
import { SlidersHorizontal } from "lucide-react";
import { useTypes } from "../../hooks/useTypes";
import ErrorText from "../error";
import Loading from "../loading";
import SliderFilter from "./sliderFilter";

const TypesFilter = ({
  typesState,
  setTypesState,
}: {
  typesState: string[];
  setTypesState: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { data, isLoading, isError } = useTypes();

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
        <ErrorText
          title="No Types"
          active={isError}
          className="flex justify-center items-center h-44"
        />
        <Loading
          size="md"
          type="spinner"
          className="text-primary flex justify-center items-center h-44"
          active={isLoading}
        />
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
            <SliderFilter name="HP:" type="info" />
            <SliderFilter name="Attack:" type="error" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TypesFilter;
