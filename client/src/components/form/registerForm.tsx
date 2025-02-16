"use client";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import BtnForm from "./btnForm";
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

const RegisterForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: Inputs) =>
      api(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        data: data,
        credential: true,
      }),
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
        <BtnForm btnLabel={"Sign Up"} mutation={mutation} />
      </div>
    </form>
  );
};

export default RegisterForm;
