import Link from "next/link";
import { ReactNode } from "react";

interface NavItemProps {
  title: string;
  path: string;
  icon?: ReactNode;
  pathname: string;
}

const NavItem = ({ title, path, icon, pathname }: NavItemProps) => {
  return (
    <li>
      <Link
        href={path}
        className={`${
          pathname.match(path) && "active !bg-primary !text-white"
        }`}
      >
        {icon}
        {title}
      </Link>
    </li>
  );
};
export default NavItem;
