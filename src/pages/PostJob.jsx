import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import { getCompanies } from "@/api/apiCompanies";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DotLoader, BarLoader } from "react-spinners";
import { State } from "country-state-city";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { addNewJob } from "@/api/apiJobs";
import Addcompanydrawer from "@/components/Addcompanydrawer";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

function PostJob() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: Companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const {
    fn: fnaddnewJob,
    data: newJob,
    error: errornewJob,
    loading: loadingnewJob,
  } = useFetch(addNewJob);

  const onformsubmit = (data) => {
    fnaddnewJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (newJob?.length > 0) navigate("/jobs");
  }, [loadingnewJob]);

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  if (!isLoaded || loadingCompanies) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <DotLoader color="blue" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full mt-2 px-4 sm:px-10">
      <h1
        className="text-2xl sm:text-4xl
              md:text-6xl font-extrabold text-center
              bg-clip-text text-transparent
              bg-linear-to-r
              from-slate-900 via-slate-700 to-slate-500
              dark:from-slate-100 dark:via-slate-300 dark:to-slate-500"
      >
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onformsubmit)}
        className="mt-4 sm:px-20 flex flex-col gap-5 w-full"
      >
        <Input placeholder="job title..." {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        <Textarea
          placeholder="job description..."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
        <div className="flex gap-3 flex-col sm:flex-row sm:gap-10">
          <div className="flex gap-2 sm:gap-10 flex-1">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full sm:flex-1">
                    <SelectValue placeholder="location" />
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
              )}
            />
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full sm:flex-1">
                    <SelectValue placeholder="company">
                      {field.value
                        ? Companies?.find(
                            (com) => com.id === Number(field.value)
                          )?.name
                        : "Company"}
                    </SelectValue>
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
              )}
            />
          </div>
          <div>
            <Addcompanydrawer fetchCompanies={fnCompanies} />
            {errors.location && (
              <p className="text-red-500">{errors.location.message}</p>
            )}
            {errors.company_id && (
              <p className="text-red-500">{errors.company_id.message}</p>
            )}
          </div>
        </div>

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="requirements">Job Requirements:</Label>

              <MDEditor
                id="requirements"
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          )}
        />

        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {errornewJob?.message && (
          <p className="text-red-500">{errornewJob?.message}</p>
        )}
        {loadingnewJob && (
          <div className="w-full">
            <BarLoader color="blue" width="100%" />
          </div>
        )}
        <Button type="submit" variant="blue" size="lg">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default PostJob;
