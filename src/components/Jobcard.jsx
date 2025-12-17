import { useUser } from "@clerk/clerk-react";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, HeartIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

function Jobcard({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) {
  const { user } = useUser();

  return (
    <Card className="flex">
      <CardHeader>
        <CardTitle className="text-xl items-center flex justify-between md:text-2xl">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={20}
              className="text-red-300 cursor-pointer"
            />
          )}
        </CardTitle>
        <CardDescription className="mt-3 flex flex-row items-center justify-between">
          <img
            src={job.company.logo_url}
            className="w-20 sm:w-26"
            alt={job.company.name}
          />
          <span className="flex justify-between items-center gap-1">
            <MapPin size={16} />
            {job.location}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-xs sm:text-base">
          {job.description.substring(0, job.description.indexOf("."))}
        </p>
      </CardContent>
      <CardFooter className="flex gap-10 sm:gap-6 justify-between">
        <Link to={`/job/${job.id}`}>
          <Button variant="blue" className="flex-1">
            More details
          </Button>
        </Link>

        <HeartIcon fill="red" />
      </CardFooter>
    </Card>
  );
}

export default Jobcard;
