import { UserData } from "@/lib/types";

interface HistoryItemProps {
  isMe: boolean;
  user: UserData;
  status: string;
  type: string;
}

const HistoryItem = ({ isMe, user, type, status }: HistoryItemProps) => {
  const battleText = isMe
    ? `You have challenged ${user.username}`
    : `${user.username} challenged you`;
  const friendText = isMe
    ? `You invited ${user.username} as friends`
    : `${user.username} invited you as friends`;

  return (
    <li>
      <div className="divider"></div>
      <h4 className="text-sm space-x-4">
        <span>{type == "battle" ? battleText : friendText}</span>
        <span className="text-primary">({status})</span>
      </h4>
    </li>
  );
};

export default HistoryItem;
