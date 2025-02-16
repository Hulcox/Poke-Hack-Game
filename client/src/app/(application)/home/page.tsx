"use client";
import BoxGrid from "@/components/boxGrid";
import TeamPreview from "@/components/team/teamPreview";
import WeatherCard from "@/components/weather/weatherCard";

const Home = () => {
  return (
    <div className="bg-neutral-content w-full h-full p-8 text-white grid grid-flow-col grid-rows-3 grid-cols-2 gap-8">
      <BoxGrid>ME</BoxGrid>
      <BoxGrid>FRIEND LIST</BoxGrid>
      <BoxGrid className="col-span-2 overflow-y-scroll">
        <h2>MY TEAMS</h2>
        <TeamPreview />
      </BoxGrid>
      <BoxGrid className="row-span-2">
        <WeatherCard />
      </BoxGrid>
    </div>
  );
};

export default Home;
