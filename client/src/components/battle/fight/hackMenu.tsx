import BtnForm from "@/components/form/btnForm";
import InputForm from "@/components/form/inputForm";
import { Hack } from "@/lib/types";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../../modal";

interface BattleEndMenuProps {
  hack: Hack | null;
  id: string;
  onHack: (difficulty: string) => void;
  onAttack: () => void;
}

const schema = z.object({
  solution: z.string().nonempty("Solution is required"),
});

type Inputs = z.infer<typeof schema>;

export const HackMenu = ({
  hack,
  id,
  onHack,
  onAttack,
}: BattleEndMenuProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });

  const closeHackMenu = () => {
    (document.getElementById(id) as HTMLDialogElement)?.close();
  };

  const mutation = useMutation({
    mutationFn: (data: Inputs) =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/hack/verify`, {
        method: "POST",
        data: { id: hack?.id, ...data },
        credential: true,
      }),
    onSuccess: (data) => {
      console.log(data);
      if (data.success == true) {
        onAttack();
        closeHackMenu();
        return;
      }

      if (hack) {
        onHack(hack?.difficulty);
        closeHackMenu();
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Modal id={id} className="text-center space-y-8">
      <h2>Hack detected !</h2>
      <p>
        <span className="text-primary font-bold">{hack?.code}</span> (
        {hack?.type})
      </p>
      <form
        className="flex flex-col item-center justify-between gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputForm
          name="solution"
          label="Solution"
          type="text"
          placeholder="Solution"
          register={register}
          isRequired
          error={errors.solution}
        />
        <div>
          <BtnForm btnLabel={"Submit"} mutation={mutation} />
        </div>
      </form>
    </Modal>
  );
};

export default HackMenu;
