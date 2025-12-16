import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DotLoader } from "react-spinners";

function Onboarding() {

  const { user, isLoaded } = useUser();

  const navigate = useNavigate();

  const setRole = async (role) => {
    try {
      await user.update({
        unsafeMetadata: { role },
      });
      navigate(role === "recruiter" ? "/post-job" : "/jobs");
    } catch (error) {
      console.log("Error updating role", error);
    }
  };

  useEffect(() => {
    if(user?.unsafeMetadata?.role){
      navigate(user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs")
    }
  },[user])


  if (!isLoaded) {
    return (
      <div className="w-full flex justify-center items-center ">
        <DotLoader color="blue" width="100%" />
      </div>
    );
  }

  return (
    <div>
      <div className="gap-16 mt-24 px-4 py-8 flex flex-col sm:gap-24 justify-center items-center">
        <h1
          className="text-3xl sm:text-5xl
              md:text-8xl font-extrabold text-center
              bg-clip-text text-transparent
              bg-linear-to-r
              from-slate-900 via-slate-700 to-slate-500
              dark:from-slate-100 dark:via-slate-300 dark:to-slate-500"
        >
          I am a ...
        </h1>
        <div className="grid grid-cols-1 gap-10 sm:gap-14 sm:grid-cols-2">
          <Button
            variant="destructive"
            size="4xl"
            onClick={() => setRole("candidate")}
          >
            Candidate
          </Button>
          <Button variant="blue" size="4xl" onClick={() => setRole("recruiter")}>
            Recruiter
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
