import { useRouter } from "next/navigation";
import Modal from "../../modal";

interface BattleEndMenuProps {
  win: boolean;
  id: string;
}

export const BattleEndMenu = ({ win, id }: BattleEndMenuProps) => {
  const router = useRouter();
  return (
    <Modal id={id} className="text-center space-y-8">
      {win ? <h2>Congratulations you won</h2> : <h2>You loose</h2>}
      <button
        className="btn btn-primary btn-sm"
        onClick={() => router.push("/home")}
      >
        go to home
      </button>
    </Modal>
  );
};

export default BattleEndMenu;
