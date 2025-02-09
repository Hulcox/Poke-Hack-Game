"use client";
import FriendNav from "@/components/form/friendNav";
import UserItem from "@/components/friendItem";
import { FriendData } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SmilePlus } from "lucide-react";

const getFriends = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/friend/all`,
    { credentials: "include" }
  );
  return await response.json();
};

const acceptFriend = async (data: { friendLinkid: number }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/friend/accept`,
    { credentials: "include", method: "PUT", body: JSON.stringify(data) }
  );
  return await response.json();
};

const deleteFriend = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/friend/${id}`,
    { credentials: "include", method: "DELETE" }
  );
  return await response.json();
};

const FriendsPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const acceptedFriend = useMutation({
    mutationFn: acceptFriend,
    onSuccess: () => {
      refetch();
    },
  });

  const deletedFriend = useMutation({
    mutationFn: deleteFriend,
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="w-full h-dvh p-8">
      <div className="bg-base-100 rounded-box ring-4 ring-neutral p-4 h-full flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-xl flex items-center gap-4">
            <SmilePlus /> Friends
          </h2>
          <FriendNav />
        </div>
        {isError && (
          <div className="flex items-center justify-center flex-1 text-error">
            Error no Data
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center flex-1 text-error">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
        {data?.message && (
          <div className="flex items-center justify-center flex-1">
            No Friends
          </div>
        )}
        {data instanceof Array && (
          <div className="mt-12">
            {data?.map((friend: FriendData, key: number) => (
              <UserItem
                key={key}
                id={friend.id}
                user={friend.friend}
                acceptedFriend={acceptedFriend}
                deletedFriend={deletedFriend}
                iDoRequest={friend.iDoRequest}
                status={friend.status}
                isToAdd={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
