import UserItem from "@/components/user/userItem";
import { FriendData } from "@/lib/types";
import FriendActionButton from "./friendActionButtons";

type FriendListProps = {
  friends: FriendData[];
  onAccept: (data: { friendLinkid: number }) => void;
  onDelete: (id: number) => void;
};

const FriendList = ({ friends, onAccept, onDelete }: FriendListProps) => {
  return (
    <ul className="mt-12">
      {friends?.map((friend, key) => (
        <UserItem key={key} user={friend.friend}>
          <FriendActionButton
            iDoRequest={friend.iDoRequest}
            status={friend.status}
            onAccept={() => onAccept({ friendLinkid: friend.id })}
            onDelete={() => onDelete(friend.id)}
          />
        </UserItem>
      ))}
    </ul>
  );
};

export default FriendList;
