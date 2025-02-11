import { Team } from "@/lib/types";
import { ReactNode } from "react";
import TeamInfo from "./teamInfo";

type TeamItemProps = {
  team: Team;
  children?: ReactNode;
};

const TeamItem = ({ team, children }: TeamItemProps) => {
  return (
    <li>
      <div className="divider"></div>
      <div className="flex items-center justify-between">
        <h4>
          #<span className="text-primary">{team.id}</span>
        </h4>
        <h4 className="max-w-10 text-clip">{team.name}</h4>
        <TeamInfo pokemons={team.pokemons} totalHp={team.totalHp} />
        {children}
      </div>
    </li>
  );
};

export default TeamItem;
