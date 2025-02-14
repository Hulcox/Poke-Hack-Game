import clsx from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  id: string;
  children: ReactNode;
  className?: string;
  withClose?: boolean;
}

const Modal = ({ id, children, className, withClose }: ModalProps) => {
  return (
    <dialog id={id} className="modal">
      <div className={twMerge(clsx("modal-box", className))}>
        {children}
        {withClose && (
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default Modal;
