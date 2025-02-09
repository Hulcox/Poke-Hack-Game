"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FriendNav = () => {
  const pathname = usePathname();

  return (
    <ul className="menu menu-horizontal space-x-4">
      <li>
        <Link
          href={"/friends"}
          className={`${pathname == "/friends" && "active !text-white"}`}
        >
          All
        </Link>
      </li>
      <li>
        <Link href={"/friends/add"} className="bg-primary text-black">
          Add
        </Link>
      </li>
    </ul>
  );
};

export default FriendNav;
