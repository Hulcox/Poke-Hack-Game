import UserItem from "@/components/user/userItem";
import { UserData } from "@/lib/types";
import UserActionButton from "./userActionButton";

type UserListProps = {
  users: UserData[];
  onAdd: (data: { friendId: number }) => void;
};

const UserList = ({ users, onAdd }: UserListProps) => {
  return (
    <ul className="mt-12">
      {users?.map((user, key) => (
        <UserItem key={key} user={user}>
          <UserActionButton
            onAdd={() =>
              onAdd({
                friendId: user.id,
              })
            }
          />
        </UserItem>
      ))}
    </ul>
  );
};

export default UserList;
