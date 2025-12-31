import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";
import { DotLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, DoorClosedIcon, DoorOpenIcon, MapPin } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import Applyjobdrawer from "@/components/Applyjobdrawer";
import ApplicationCard from "@/components/ApplicationCard";

function Jobpage() {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    fn: fnJob,
    data: job,
    loading: loadingJob,
    error,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const {
    fn: fnhiringJobStatus,
    data: hiringJobStatus,
    loading: loadinghiringJobStatus,
  } = useFetch(updateHiringStatus, {
    job_id: id,
  });

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnhiringJobStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <DotLoader color="blue" />
      </div>
    );
  }

  if (loadinghiringJobStatus) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <DotLoader color="blue" />
      </div>
    );
  }
  
  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-3 sm:flex-row px-4 sm:px-10 py-2 sm:justify-between sm:items-center">
        <div
          className="text-xl sm:text-4xl lg:text-6xl font-extrabold 
              bg-clip-text text-transparent
              bg-linear-to-r
              from-slate-900 via-slate-700 to-slate-500
              dark:from-slate-100 dark:via-slate-300 dark:to-slate-500"
        >
          {job?.title}
        </div>
        <img
          src={job?.company?.logo_url}
          className="w-28 md:w-56"
          alt={job?.company?.name}
        />
      </div>
      <div className="mt-4 flex justify-between items-center px-4 sm:px-10">
        <div>
          <span className="flex items-center gap-1">
            <MapPin size={16} />
            {job?.location}
          </span>
        </div>
        <div>
          <span className="flex items-center gap-1">
            <Briefcase size={16} />
            {job?.applications?.length} Applicants
          </span>
        </div>
        <div>
          {job?.isOpen ? (
            <span className="flex items-center gap-1">
              <DoorOpenIcon size={16} />
              Open
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <DoorClosedIcon size={16} />
              Closed
            </span>
          )}
        </div>
      </div>
      {job?.recruiter_id === user?.id && (
        <div className="mt-4 flex justify-between items-center px-4 sm:px-10">
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="mt-8 px-4 flex flex-col gap-3 sm:gap-6 sm:px-10">
        <h1 className="font-extrabold sm:text-4xl  text-2xl ">About the Job</h1>
        <p className="text-sm sm:text-xl">{job?.description}</p>
      </div>
      <div className="mt-8 px-4 flex flex-col gap-3 sm:gap-6 sm:px-10">
        <h1 className="font-extrabold sm:text-4xl text-2xl">
          What are we looking for
        </h1>
        <MDEditor.Markdown source={job?.requirements} />
      </div>

      {job?.recruiter_id !== user?.id && user?.unsafeMetadata?.role === "candidate" && (
        <div className="flex justify-center mt-8">
          <Applyjobdrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications.find((app)=> app.candidate_id === user.id)}
           />
        </div>
        )
      }

      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="mt-5 flex flex-col gap-3 px-4 sm:px-10 py-2">
          <h2 className="font-extrabold sm:text-4xl text-2xl mb-3">Applications</h2>
          {job?.applications.map((application) => {
            return <ApplicationCard
            key={application.id} application={application} />
          })}
        </div>
      )}
    </div>
  );
}

export default Jobpage;
