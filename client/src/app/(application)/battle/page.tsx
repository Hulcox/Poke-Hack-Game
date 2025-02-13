"use client";
import BattlePreview from "@/components/battle/battlePreview";
import BattleSelection from "@/components/battle/battleSelection";
import BoxRoot from "@/components/boxRoot";
import ErrorText from "@/components/error";
import Header from "@/components/header";
import TeamList from "@/components/team/teamList";
import BattleFriendList from "@/components/user/battleFriendList";
import { useFriendsforBattle } from "@/hooks/useFriend";
import { useGeolocation } from "@/hooks/useGeolocalisation";
import { useTeamAll } from "@/hooks/useTeam";
import { useWeather } from "@/hooks/useWeather";
import { Team } from "@/lib/types";
import { Sword } from "lucide-react";
import { useState } from "react";

const BattlePage = () => {
  const [attackerTeam, setAttackerTeam] = useState<Team | null>(null);
  const [defenderTeam, setDefenderTeam] = useState<Team | null>(null);

  const { teams, isError, isSuccess, isLoading } = useTeamAll();
  const friends = useFriendsforBattle();

  const { location, errorGeoloc } = useGeolocation();
  const { weather, isError: weatherError } = useWeather(location);

  if (errorGeoloc || weatherError) {
    return (
      <BoxRoot>
        <ErrorText
          title="Imposible to get weather, we can start battle"
          active
          className="text-error flex justify-center items-center"
        />
      </BoxRoot>
    );
  }

  return (
    <BoxRoot>
      <Header title="Battle" icon={<Sword />} />
      {!attackerTeam ? (
        <BattleSelection
          title="Choose your team"
          errorText={"You don't have team"}
          isError={isError}
          isLoading={isLoading}
        >
          {isSuccess && (
            <TeamList
              teams={teams}
              onChoose={(team: Team) => setAttackerTeam(team)}
            />
          )}
        </BattleSelection>
      ) : !defenderTeam ? (
        <div>
          <BattleSelection
            title="Choose your adverser"
            errorText={"You don't have friend with a team to do a batlte"}
            isError={friends.isError}
            isLoading={friends.isLoading}
            goBack={() => setAttackerTeam(null)}
          >
            {friends.isSuccess && (
              <BattleFriendList
                friends={friends.data}
                onChoose={(team: Team) => setDefenderTeam(team)}
              />
            )}
          </BattleSelection>
        </div>
      ) : (
        <BattlePreview
          attackerTeam={attackerTeam}
          defenderTeam={defenderTeam}
          weather={weather}
          goBack={() => setDefenderTeam(null)}
        />
      )}
    </BoxRoot>
  );
};
export default BattlePage;
