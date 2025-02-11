import { User } from "lucide-react";

const UserAvatar = () => {
  return (
    <div className="avatar placeholder">
      <div className="bg-neutral text-neutral-content w-12 rounded-full">
        <span>
          <User />
        </span>
      </div>
    </div>
  );
};

export default UserAvatar;
