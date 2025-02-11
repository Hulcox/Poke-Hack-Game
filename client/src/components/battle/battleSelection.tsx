import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";
import ErrorText from "../error";
import Loading from "../loading";

interface BattleSelectionProps {
  title: string;
  errorText: string;
  isLoading: boolean;
  isError: boolean;
  children: ReactNode;
  goBack?: () => void;
}

const BattleSelection = ({
  title,
  errorText,
  isLoading,
  isError,
  children,
  goBack,
}: BattleSelectionProps) => {
  return (
    <div>
      <div className="flex items-baseline gap-4">
        {goBack && (
          <button className="btn btn-sm btn-square" onClick={goBack}>
            <ChevronLeft />
          </button>
        )}
        <h4 className="text-xl mt-8">{title}</h4>
      </div>
      <ErrorText
        title={errorText}
        active={isError}
        className="text-center text-error"
      />
      <Loading
        size="lg"
        type="spinner"
        className="text-primary text-center"
        active={isLoading}
      />
      {children}
    </div>
  );
};

export default BattleSelection;
