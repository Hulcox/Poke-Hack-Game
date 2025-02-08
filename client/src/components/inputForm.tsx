"use client";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FieldError, Path, UseFormRegister } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface InputFormProps<T extends object> {
  type: string;
  placeholder: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  isRequired: boolean;
  isPassword?: boolean;
  error?: FieldError;
  className?: string;
}

const InputForm = <T extends object>({
  type,
  placeholder,
  name,
  register,
  isRequired,
  error,
  isPassword = false,
  className,
}: InputFormProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const toogleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="label">
        <span className="label-text !text-white capitalize">{name}</span>
      </div>

      <label
        className={twMerge(
          clsx(
            "input input-bordered input-primary text-xs w-full flex items-center gap-2",
            error && "border-error",
            className
          )
        )}
      >
        <input
          type={showPassword ? "text" : type}
          className="grow"
          placeholder={placeholder}
          {...register(name, { required: isRequired })}
        />
        <div className={`${isPassword ? "block" : "hidden"}`}>
          {showPassword ? (
            <EyeOff className="cursor-pointer" onClick={toogleShowPassword} />
          ) : (
            <Eye className="cursor-pointer" onClick={toogleShowPassword} />
          )}
        </div>
      </label>
      {error && <p className="text-error !text-xs mt-4">{error.message}</p>}
    </div>
  );
};

export default InputForm;
