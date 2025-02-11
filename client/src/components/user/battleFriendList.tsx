import { FriendData, Team } from "@/lib/types";
import BattleActionButtons from "../battle/battleActionButton";
import TeamInfo from "../team/teamInfo";
import UserItem from "./userItem";

type BattleFriendProps = {
  friends: FriendData[];
  onChoose: (team: Team) => void;
};

const BattleFriendList = ({ friends, onChoose }: BattleFriendProps) => {
  return (
    <ul>
      {friends?.map((friend, key) => (
        <UserItem key={key} user={friend.friend}>
          {friend.friend.teams.map((team, key: number) => (
            <TeamInfo
              key={key}
              pokemons={team.pokemons}
              totalHp={team.totalHp}
            />
          ))}
          <BattleActionButtons
            onChoose={() => onChoose(friend.friend.teams[0])}
          />
        </UserItem>
      ))}
    </ul>
  );
};

export default BattleFriendList;
