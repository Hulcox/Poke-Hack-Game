import { Search } from "lucide-react";

const SearchFilter = ({
  setSearchState,
}: {
  setSearchState: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <label className="input input-bordered border-neutral-content flex items-center justify-between gap-2 w-1/2">
      <input
        type="text"
        className="!text-xs"
        placeholder="Search pokemon"
        onChange={(e) => setSearchState(e.target.value)}
      />
      <Search />
    </label>
  );
};

export default SearchFilter;
