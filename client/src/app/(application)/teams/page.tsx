"use client";

import BoxRoot from "@/components/boxRoot";
import Header from "@/components/header";
import TeamPreview from "@/components/team/teamPreview";
import { Cat } from "lucide-react";
import { useRouter } from "next/navigation";

const TeamPage = () => {
  const router = useRouter();

  const goToCreatePage = () => {
    router.push("/teams/create");
  };

  return (
    <BoxRoot>
      <Header
        title="My Teams"
        icon={<Cat />}
        action={
          <button className="btn btn-sm btn-primary" onClick={goToCreatePage}>
            Create a new team
          </button>
        }
      />{" "}
      <TeamPreview className="mt-12" action />
    </BoxRoot>
  );
};

export default TeamPage;
