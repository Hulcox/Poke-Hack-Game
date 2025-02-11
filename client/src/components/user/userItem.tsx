import { UserData } from "@/lib/types";
import { ReactNode } from "react";
import UserAvatar from "./userAvatar";

type UserItemProps = {
  user: UserData;
  children?: ReactNode;
};

const UserItem = ({ user, children }: UserItemProps) => {
  return (
    <li>
      <div className="divider"></div>
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-center gap-4">
          <UserAvatar />
          <h3 className="space-x-2">
            <span>{user.username}</span>
            <span className="text-primary">#{user.code}</span>
          </h3>
        </div>
        {children}
      </div>
    </li>
  );
};

export default UserItem;
