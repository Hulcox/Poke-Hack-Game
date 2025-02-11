import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
}

const Header = ({ title, icon, action }: HeaderProps) => (
  <div className="flex justify-between items-center">
    <h2 className="text-xl flex items-center gap-4">
      {icon} {title}
    </h2>
    {action}
  </div>
);

export default Header;
