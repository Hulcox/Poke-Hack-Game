import LoginForm from "@/components/form/loginForm";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="h-dvh w-dvh relative">
      <Image src={"/images/login.jpg"} alt="login background" fill />
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-1/2 bg-neutral ring-4 ring-primary rounded-box shadow-lg shadow-primary p-8 text-white space-y-4">
        <h2 className="text-2xl">
          Welcome to <span className="text-primary">PokeHack </span>Game
        </h2>
        <p>The first hacking game during pokemon battles</p>
        <h2 className="text-2xl text-primary py-8">Sign In:</h2>
        <LoginForm />
        <div>
          <Link href={"/auth/register"} className="text-xs link link-primary">
            {"You don't have an account?"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
