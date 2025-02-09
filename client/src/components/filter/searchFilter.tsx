import clsx from "clsx";
import { Search } from "lucide-react";
import { twMerge } from "tailwind-merge";

const SearchFilter = ({
  setSearchState,
  className,
  placeholder,
}: {
  setSearchState: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  placeholder: string;
}) => {
  return (
    <label
      className={twMerge(
        clsx(
          "input input-bordered border-neutral-content flex items-center justify-between gap-2 w-1/2",
          className
        )
      )}
    >
      <input
        type="text"
        className="!text-xs"
        placeholder={placeholder}
        onChange={(e) => setSearchState(e.target.value)}
      />
      <Search />
    </label>
  );
};

export default SearchFilter;
