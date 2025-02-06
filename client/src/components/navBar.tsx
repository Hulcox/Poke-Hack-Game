"use client";
import {
  Archive,
  BookOpenText,
  Cat,
  Home,
  SmilePlus,
  Sword,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center px-2 py-4 gap-8 bg-base-100 h-full">
      <div className="text-center">
        <h1>Welcome to</h1>
        <h1 className="text-primary text-2xl">Poké Hack</h1>
      </div>
      <ul className="menu text-base-content flex-1 w-80 p-4">
        {/* Sidebar content here */}
        <li>
          <Link
            href={"/home"}
            className={`${
              pathname.match("/home") && "active !bg-primary !text-white"
            }`}
          >
            <Home className="mr-2" />
            Home
          </Link>
        </li>
        <div className="divider"></div>
        <li>
          <Link
            href={"/board"}
            className={`${
              pathname.match("/board") && "active !bg-primary !text-white"
            }`}
          >
            <Sword className="mr-2" />
            Fights
          </Link>
        </li>
        <li>
          <Link
            href={"/teams"}
            className={`${
              pathname.match("/teams") && "active !bg-primary !text-white"
            }`}
          >
            <Cat className="mr-2" />
            Teams
          </Link>
        </li>
        <div className="divider"></div>
        <li>
          <Link
            href={"/pokedex"}
            className={`${
              pathname.match("/pokedex") && "active !bg-primary !text-white"
            }`}
          >
            <BookOpenText className="mr-2" />
            Pokédex
          </Link>
        </li>
        <div className="divider"></div>
        <li>
          <a>
            <SmilePlus className="mr-2" />
            Friends
          </a>
        </li>
        <li>
          <a>
            <Archive className="mr-2" />
            History
          </a>
        </li>
        <li>
          <a>
            {" "}
            <UserCircle className="mr-2" />
            Profile (name)
          </a>
        </li>
        <div className="divider"></div>
      </ul>
      <button className="btn btn-outline btn-error btn-sm">Log Out</button>
    </div>
  );
};

export default NavBar;
