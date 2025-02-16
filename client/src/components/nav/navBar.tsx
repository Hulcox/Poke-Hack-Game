"use client";
import { api } from "@/utils/api";
import {
  Archive,
  BookOpenText,
  Cat,
  Home,
  SmilePlus,
  Sword,
  UserCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import NavItem from "./navItem";

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    api(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      credential: true,
    });
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center px-2 py-4 gap-8 bg-base-100 h-full">
      <div className="text-center">
        <h1>Welcome to</h1>
        <h1 className="text-primary text-2xl">Poké Hack</h1>
      </div>
      <ul className="menu text-base-content flex-1 w-80 p-4">
        <NavItem
          title="Home"
          path="/home"
          pathname={pathname}
          icon={<Home className="mr-2" />}
        />
        <div className="divider"></div>
        <NavItem
          title="Battle"
          path="/battle"
          pathname={pathname}
          icon={<Sword className="mr-2" />}
        />
        <NavItem
          title="Teams"
          path="/teams"
          pathname={pathname}
          icon={<Cat className="mr-2" />}
        />
        <div className="divider"></div>
        <NavItem
          title="Pokédex"
          path="/pokedex"
          pathname={pathname}
          icon={<BookOpenText className="mr-2" />}
        />
        <div className="divider"></div>
        <NavItem
          title="Friends"
          path="/friends"
          pathname={pathname}
          icon={<SmilePlus className="mr-2" />}
        />
        <NavItem
          title="History"
          path="/history"
          pathname={pathname}
          icon={<Archive className="mr-2" />}
        />
        <li>
          <a>
            {" "}
            <UserCircle className="mr-2" />
            Profile (name)
          </a>
        </li>
        <div className="divider"></div>
      </ul>
      <button className="btn btn-outline btn-error btn-sm" onClick={logout}>
        Log Out
      </button>
    </div>
  );
};

export default NavBar;
