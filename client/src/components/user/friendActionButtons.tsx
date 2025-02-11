import { FriendStatus } from "@/lib/types";
import { Trash } from "lucide-react";

interface FriendActionButtonsProps {
  iDoRequest: boolean;
  status: FriendStatus;
  onAccept: () => void;
  onDelete: () => void;
}

const FriendActionButton = ({
  iDoRequest,
  status,
  onAccept,
  onDelete,
}: FriendActionButtonsProps) => {
  return (
    <>
      <div className="flex items-center justify-center gap-4">
        {!iDoRequest && status == FriendStatus.PENDING && (
          <h4 className="text-warning text-sm">not yet accepted</h4>
        )}
        {iDoRequest && status == FriendStatus.PENDING && (
          <button className="btn btn-sm btn-success" onClick={onAccept}>
            Accept
          </button>
        )}
        <button className="btn btn-sm btn-square btn-error" onClick={onDelete}>
          <Trash />
        </button>
      </div>
    </>
  );
};

export default FriendActionButton;
