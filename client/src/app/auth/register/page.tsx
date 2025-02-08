import RegisterForm from "@/components/registerForm";
import Image from "next/image";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="h-dvh w-dvh relative">
      <Image src={"/images/login.jpg"} alt="login background" fill />
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-1/2 bg-neutral ring-4 ring-primary rounded-box shadow-lg shadow-primary p-8 text-white space-y-4">
        <h2 className="text-2xl">
          Welcome to <span className="text-primary">PokeHack </span>Game
        </h2>
        <h2 className="text-2xl text-primary py-8">Sign Up:</h2>
        <RegisterForm />
        <div>
          <Link href={"/auth/login"} className="text-xs link link-primary">
            {"You have an account?"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
