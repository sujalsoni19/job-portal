import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { DotLoader } from "react-spinners";
import Jobcard from "@/components/Jobcard";
import React, { useEffect, useState } from "react";
import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {State} from "country-state-city";

function JobListing() {
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchQuery, setsearchQuery] = useState("");
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: Jobs,
    loading: loadingJobs,
    error,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const {
    fn: fnCompanies,
    data: Companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search-query") || "";
    setsearchQuery(query);
  };

  const clearFilter = () => {
    setCompany_id("");
    setLocation("");
    setsearchQuery("");
  };

  if (!isLoaded) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <DotLoader color="blue" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full mt-10 px-2">
      <h1
        className="text-2xl sm:text-4xl
              md:text-6xl font-extrabold text-center
              bg-clip-text text-transparent
              bg-linear-to-r
              from-slate-900 via-slate-700 to-slate-500
              dark:from-slate-100 dark:via-slate-300 dark:to-slate-500"
      >
        Latest Jobs
      </h1>

      <form
        onSubmit={handleSearch}
        className="mt-7 w-full flex px-2 sm:px-10 gap-5 items-center justify-center"
      >
        <Input
          type="text"
          placeholder="Search Jobs by title..."
          name="search-query"
          className="w-full h-12 pl-4"
        />
        <Button variant="blue">Search</Button>
      </form>

      <div className="mt-2 flex flex-col sm:flex-row px-2 sm:px-10 gap-2 sm:gap-5 items-center justify-center w-full">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="w-full sm:flex-1">
            <SelectValue placeholder="Filter by State" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger className="w-full sm:flex-1">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={clearFilter} variant="destructive" className="w-full sm:w-auto">
          Clear filters
        </Button>
      </div>

      {loadingJobs && (
        <div className="flex-1 w-full flex justify-center items-center">
          <DotLoader color="blue" />
        </div>
      )}

      {loadingJobs === false && (
        <div className="mt-6 sm:mt-12 px-4 grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Jobs?.length ? (
            Jobs?.map((job) => {
              return (
                <Jobcard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="col-span-full flex justify-center items-center text-2xl">
              <h1>No Jobs Found</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JobListing;
