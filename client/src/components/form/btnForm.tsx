import { UseMutationResult } from "@tanstack/react-query";

type BtnFormProps<TData, TVariables> = {
  mutation: UseMutationResult<TData, Error, TVariables, unknown>;
  btnLabel: string;
};

const BtnForm = <TData, TVariables>({
  mutation,
  btnLabel,
}: BtnFormProps<TData, TVariables>) => {
  return (
    <>
      <button type="submit" className="btn btn-sm btn-primary">
        {mutation.isPending && (
          <span className="loading loading-spinner"></span>
        )}
        {btnLabel}
      </button>
      {mutation.error && (
        <p className="text-error !text-xs mt-4">{mutation.error.message}</p>
      )}
    </>
  );
};

export default BtnForm;
