"use client";
import BoxRoot from "@/components/boxRoot";
import SearchFilter from "@/components/filter/searchFilter";
import FriendNav from "@/components/form/friendNav";
import Header from "@/components/header";
import UserList from "@/components/user/userList";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { SmilePlus } from "lucide-react";
import { useEffect, useState } from "react";

const AddFriendsPage = () => {
  const [searchState, setSearchState] = useState("");

  const users = useMutation({
    mutationFn: (username: string) =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/user/name?username=${username}`, {
        credential: true,
      }),
  });

  const addFriend = useMutation({
    mutationFn: (data: { friendId: number }) =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/friend/add`, {
        method: "POST",
        data: data,
        credential: true,
      }),
    onSuccess: () => {
      users.mutate(searchState);
    },
  });

  useEffect(() => {
    users.mutate(searchState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState]);

  return (
    <BoxRoot>
      <Header title="Friends" icon={<SmilePlus />} action={<FriendNav />} />
      <div className="flex justify-center py-8 w-full">
        <SearchFilter
          setSearchState={setSearchState}
          placeholder="Search User"
        />
      </div>
      {users.data?.length === 0 && (
        <div className="text-center text-error">No user found!</div>
      )}
      {users.data?.length > 0 && (
        <UserList users={users.data} onAdd={addFriend.mutate} />
      )}
    </BoxRoot>
  );
};

export default AddFriendsPage;
