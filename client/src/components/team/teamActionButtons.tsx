import { Pencil, Trash } from "lucide-react";

interface TeamActionButtonsProps {
  onUpdate: () => void;
  onDelete: () => void;
}

const TeamActionButtons = ({ onUpdate, onDelete }: TeamActionButtonsProps) => (
  <div className="flex justify-center gap-4">
    <button
      className="btn btn-square btn-outline btn-sm text-neutral btn-success"
      onClick={onUpdate}
    >
      <Pencil />
    </button>
    <button
      className="btn btn-square btn-outline btn-sm text-neutral btn-error"
      onClick={onDelete}
    >
      <Trash />
    </button>
  </div>
);

export default TeamActionButtons;
