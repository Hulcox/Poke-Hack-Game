interface BattleActionButtonsProps {
  onChoose: () => void;
}

const BattleActionButtons = ({ onChoose }: BattleActionButtonsProps) => (
  <div className="flex justify-center gap-4">
    <button
      className="btn btn-outline btn-sm text-neutral btn-primary"
      onClick={onChoose}
    >
      choose
    </button>
  </div>
);

export default BattleActionButtons;
