"use client";
import SearchFilter from "@/components/filter/searchFilter";
import FriendNav from "@/components/form/friendNav";
import UserItem from "@/components/friendItem";
import { UserData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { SmilePlus } from "lucide-react";
import { useEffect, useState } from "react";

const getUserByUsername = async (username: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/name?username=${username}`,
    { credentials: "include" }
  );
  return await response.json();
};

const addFriend = async (data: { friendId: number }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/friend/add`,
    { credentials: "include", method: "POST", body: JSON.stringify(data) }
  );
  return await response.json();
};

const AddFriendsPage = () => {
  const [searchState, setSearchState] = useState("");

  const users = useMutation({
    mutationFn: getUserByUsername,
  });

  const addedFriend = useMutation({
    mutationFn: addFriend,
    onSuccess: () => {
      users.mutate(searchState);
    },
  });

  useEffect(() => {
    users.mutate(searchState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState]);

  return (
    <div className="w-full h-dvh p-8">
      <div className="bg-base-100 rounded-box ring-4 ring-neutral p-4 h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl flex items-center gap-4">
            <SmilePlus /> Friends
          </h2>
          <FriendNav />
        </div>
        <div className="flex justify-center py-8 w-full">
          <SearchFilter
            setSearchState={setSearchState}
            placeholder="Search User"
          />
        </div>
        {users.data && users.data.length == 0 && (
          <div className="text-center text-error ">No user found !</div>
        )}
        {users.data &&
          users.data.length > 0 &&
          users.data.map((user: UserData, key: number) => (
            <UserItem key={key} user={user} isToAdd addedFriend={addedFriend} />
          ))}
      </div>
    </div>
  );
};

export default AddFriendsPage;
