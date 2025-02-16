"use client";
import { useHistory } from "@/hooks/useHistory";
import { History } from "@/lib/types";
import { DateTime } from "luxon";
import ErrorText from "../error";
import Loading from "../loading";
import HistoryItem from "./historyItem";

interface HistoryPreviewProps {
  className?: string;
}

const HistoryPreview = ({ className }: HistoryPreviewProps) => {
  const { data, isLoading, isError } = useHistory();

  const sortHistoryByTime = (a: History, b: History) => {
    const diff = DateTime.fromISO(b.time)
      .diff(DateTime.fromISO(a.time))
      .as("milliseconds");
    return diff;
  };

  return (
    <div className={className}>
      <ErrorText
        title={"You don't have history"}
        active={isError}
        className="text-center"
      />
      <Loading
        size="lg"
        type="spinner"
        className="text-primary text-center"
        active={isLoading}
      />
      <ul>
        {data
          ?.sort((a: History, b: History) => sortHistoryByTime(a, b))
          .map((history: History, key: number) => (
            <HistoryItem
              key={key}
              isMe={history.isMe}
              user={history.user}
              type={history.type}
              status={history.status}
            />
          ))}
      </ul>
    </div>
  );
};

export default HistoryPreview;
