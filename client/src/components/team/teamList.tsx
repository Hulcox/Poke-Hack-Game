import PokemonBullet from "@/components/pokemon/pokemonBullet";
import { Team } from "@/lib/types";
import TeamActionButtons from "./teamActionButtons";

interface TeamListProps {
  teams: Team[];
  onDelete: (id: number) => void;
  onUpdate: (path: string) => void;
}

const TeamList = ({ teams, onDelete, onUpdate }: TeamListProps) => (
  <>
    {teams.map((team) => (
      <div key={team.id}>
        <div className="divider"></div>
        <div className="flex items-center justify-between">
          <h4>
            #<span className="text-primary">{team.id}</span>
          </h4>
          <h4 className="max-w-10 text-clip">{team.name}</h4>
          <div className="flex items-center gap-4">
            {team.pokemons.map(({ img }, key) => (
              <PokemonBullet key={key} img={img} />
            ))}
          </div>
          <h4>
            Total Hp: <span className="text-info">{team.totalHp}</span>
          </h4>
          <TeamActionButtons
            onUpdate={() => onUpdate(`/teams/update/${team.id}`)}
            onDelete={() => onDelete(team.id)}
          />
        </div>
      </div>
    ))}
  </>
);

export default TeamList;
