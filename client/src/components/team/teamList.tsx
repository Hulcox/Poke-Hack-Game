import { Team } from "@/lib/types";
import BattleActionButtons from "../battle/battleActionButton";
import TeamActionButtons from "./teamActionButtons";
import TeamItem from "./teamItem";

interface TeamListProps {
  teams: Team[];
  onChoose?: (team: Team) => void;
  onDelete?: (id: number) => void;
  onUpdate?: (path: string) => void;
}

const TeamList = ({ teams, onChoose, onDelete, onUpdate }: TeamListProps) => (
  <ul>
    {teams.map((team, key) => (
      <TeamItem key={key} team={team}>
        {onChoose && <BattleActionButtons onChoose={() => onChoose(team)} />}
        {onDelete && onUpdate && (
          <TeamActionButtons
            onUpdate={() => onUpdate(`/teams/update/${team.id}`)}
            onDelete={() => onDelete(team.id)}
          />
        )}
      </TeamItem>
    ))}
  </ul>
);

export default TeamList;
