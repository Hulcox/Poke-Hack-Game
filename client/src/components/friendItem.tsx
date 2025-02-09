import { FriendStatus, UserData } from "@/lib/types";
import { UseMutationResult } from "@tanstack/react-query";
import { Trash, User } from "lucide-react";

type UserItemProps<TData> = {
  addedFriend?: UseMutationResult<TData, Error, { friendId: number }, unknown>;
  acceptedFriend?: UseMutationResult<
    TData,
    Error,
    { friendLinkid: number },
    unknown
  >;
  deletedFriend?: UseMutationResult<TData, Error, number, unknown>;
  id?: number;
  user: UserData;
  status?: FriendStatus;
  iDoRequest?: boolean;
  isToAdd?: boolean;
};

const UserItem = <TData,>({
  id,
  user,
  status,
  iDoRequest,
  addedFriend,
  acceptedFriend,
  deletedFriend,
  isToAdd,
}: UserItemProps<TData>) => {
  return (
    <div>
      <div className="divider"></div>
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span>
                <User />
              </span>
            </div>
          </div>
          <h3 className="space-x-2">
            <span>{user.username}</span>
            <span className="text-primary">#{user.code}</span>
          </h3>
        </div>
        {isToAdd == true && addedFriend && (
          <div className="flex items-center justify-center gap-4">
            <button
              className="btn btn-sm btn-primary"
              onClick={() =>
                addedFriend.mutate({
                  friendId: user.id || 0,
                })
              }
            >
              Add
            </button>
          </div>
        )}
        {isToAdd == false && (
          <div className="flex items-center justify-center gap-4">
            {!iDoRequest && status == FriendStatus.PENDING && (
              <h4 className="text-warning text-sm">not yet accepted</h4>
            )}
            {iDoRequest && status == FriendStatus.PENDING && acceptedFriend && (
              <button
                className="btn btn-sm btn-success"
                onClick={() =>
                  acceptedFriend.mutate({
                    friendLinkid: id || 0,
                  })
                }
              >
                Accept
              </button>
            )}
            {deletedFriend && (
              <button
                className="btn btn-sm btn-square btn-error"
                onClick={() => deletedFriend.mutate(id || 0)}
              >
                <Trash />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserItem;
