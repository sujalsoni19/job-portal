import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { applyToJob } from "@/api/apiApplications";
import { DotLoader } from "react-spinners";

// How Zod + Hook Form work together
// When the user submits:

// handleSubmit is called

// React Hook Form collects all field values

// Values are sent to Zod

// Zod validates against schema

// If ❌ invalid → errors populated

// If ✅ valid → onformsubmit(data) runs

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be atleast zero" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["intermediate", "graduate", "postgraduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file?.[0] &&
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file[0].type),
      { message: "Only PDF or Word documents are allowed" }
    ),
});

function Applyjobdrawer({ job, user, applied = false, fetchJob }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onformsubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <div>
      <Drawer open={applied ? false : undefined}>
        <DrawerTrigger asChild>
          <Button
            size="lg"
            variant={job?.isOpen && !applied ? "blue" : "destructive"}
            disabled={!job?.isOpen || applied}
          >
            {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Apply for {job?.title} at {job?.company?.name}
            </DrawerTitle>
            <DrawerDescription>Please fill the form below.</DrawerDescription>
          </DrawerHeader>
          <form
            onSubmit={handleSubmit(onformsubmit)}
            className="px-4 sm:px-8 flex flex-col gap-3"
          >
            <Input
              type="number"
              placeholder="Years of experience"
              {...register("experience", {
                valueAsNumber: true,
              })}
            />
            {errors.experience && (
              <p className="text-red-500">{errors.experience.message}</p>
            )}
            <Input
              type="text"
              placeholder="skills(comma separated)"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-red-500">{errors.skills.message}</p>
            )}
            <div>
              <fieldset className="mb-4">
                <legend className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select your highest education:
                </legend>

                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="intermediate"
                          id="intermediate"
                        />
                        <Label htmlFor="intermediate">Intermediate</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="graduate" id="graduate" />
                        <Label htmlFor="graduate">Graduate</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="postgraduate"
                          id="postgraduate"
                        />
                        <Label htmlFor="postgraduate">Postgraduate</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </fieldset>
            </div>
            {errors.education && (
              <p className="text-red-500">{errors.education.message}</p>
            )}
            <label
              htmlFor="resume"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Upload your resume:
            </label>
            <Input
              id="resume"
              type="file"
              accept=".pdf, .doc, .docx"
              {...register("resume")}
              className="file:cursor-pointer dark:file:bg-gray-600 file:bg-gray-300 file:p-2 file:rounded-md file:text-sm "
            />
            {errors.resume && (
              <p className="text-red-500">{errors.resume.message}</p>
            )}
            {errorApply?.message && (
              <p className="text-red-500">{errorApply.message}</p>
            )}
            {loadingApply && (
              <div className="flex-1 flex justify-center items-center">
                <DotLoader color="blue" />
              </div>
            )}
            <Button type="submit" variant="blue">
              Apply
            </Button>
          </form>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default Applyjobdrawer;
