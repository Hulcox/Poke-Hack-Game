import WeatherCard from "@/components/weatherCard";

const Home = () => {
  return (
    <div className="bg-neutral-content w-full h-full p-8 text-white grid grid-flow-col grid-rows-3 grid-cols-2 gap-8">
      <div className="bg-neutral rounded-box transition-all hover:scale-[1.02] p-4 ring-4 ring-base-100 shadow-md shadow-black cursor-pointer">
        ME
      </div>
      <div className="bg-neutral rounded-box transition-all hover:scale-[1.02] p-4">
        FRIEND LIST
      </div>
      <div className="bg-neutral rounded-box transition-all hover:scale-[1.02] p-4 col-span-2">
        MY TEAMS
      </div>
      <div className="bg-neutral rounded-box transition-all hover:scale-[1.02] p-4 row-span-2">
        <WeatherCard />
      </div>
    </div>
  );
};

export default Home;
