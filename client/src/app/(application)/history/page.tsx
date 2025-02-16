import BoxRoot from "@/components/boxRoot";
import Header from "@/components/header";
import HistoryPreview from "@/components/history/historyPreview";
import { Archive } from "lucide-react";

const HistoryPage = () => {
  return (
    <BoxRoot>
      <Header title="History" icon={<Archive />} /> <HistoryPreview />
    </BoxRoot>
  );
};

export default HistoryPage;
