"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import InputForm from "./inputForm";

const schema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

type Inputs = z.infer<typeof schema>;

const loginUser = async (data: Inputs) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }
  return result;
};

const RegisterForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      router.push("/auth/login");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form
      className="flex flex-col w-2/3 h-1/2 justify-between gap-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-8">
        <InputForm
          name="username"
          type="text"
          placeholder="Username"
          register={register}
          isRequired
          error={errors.username}
        />
        <InputForm
          name="email"
          type="email"
          placeholder="Email"
          register={register}
          isRequired
          error={errors.email}
        />
        <InputForm
          name="password"
          type="password"
          placeholder="Password"
          register={register}
          isRequired
          isPassword
          error={errors.password}
        />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          {mutation.isPending && (
            <span className="loading loading-spinner"></span>
          )}
          Submit
        </button>
        {mutation.error && (
          <p className="text-error !text-xs mt-4">{mutation.error.message}</p>
        )}
      </div>
    </form>
  );
};

export default RegisterForm;
