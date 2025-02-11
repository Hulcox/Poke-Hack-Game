"use client";
import BoxRoot from "@/components/boxRoot";
import ErrorText from "@/components/error";
import FriendNav from "@/components/form/friendNav";
import Header from "@/components/header";
import Loading from "@/components/loading";
import FriendList from "@/components/user/friendList";
import { useFriendAll } from "@/hooks/useFriend";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { SmilePlus } from "lucide-react";

const FriendsPage = () => {
  const { data, isLoading, isError, refetch } = useFriendAll();

  const acceptFriend = useMutation({
    mutationFn: (data: { friendLinkid: number }) =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/friend/accept`, {
        method: "PUT",
        data: data,
        credential: true,
      }),
    onSuccess: () => {
      refetch();
    },
  });

  const deletFriend = useMutation({
    mutationFn: (id: number) =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/friend/${id}`, {
        method: "DELETE",
        credential: true,
      }),
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <BoxRoot className="flex flex-col">
      <Header title="Friends" icon={<SmilePlus />} action={<FriendNav />} />
      <ErrorText
        title="Error no Data"
        active={isError}
        className="flex items-center justify-center flex-1 text-error"
      />
      <Loading
        size="lg"
        type="spinner"
        active={isLoading}
        className="flex items-center justify-center flex-1 text-error"
      />
      {data?.message && (
        <div className="flex items-center justify-center flex-1">
          No Friends
        </div>
      )}

      <FriendList
        friends={data}
        onAccept={acceptFriend.mutate}
        onDelete={deletFriend.mutate}
      />
    </BoxRoot>
  );
};

export default FriendsPage;
