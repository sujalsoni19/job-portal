import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useFetch from "@/hooks/useFetch";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BarLoader } from "react-spinners";
import { addNewCompany } from "@/api/apiCompanies";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  logo: z
    .any()
    .refine(
      (file) => file?.[0] && ["image/png", "image/jpeg"].includes(file[0].type),
      { message: "Only Images are allowed" }
    ),
});

function Addcompanydrawer({ fetchCompanies }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    fn: fnaddCompany,
    data: addCompany,
    error: erroraddCompany,
    loading: loadingaddCompany,
  } = useFetch(addNewCompany);

  const onsubmit = (data) => {
    fnaddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (addCompany?.length > 0) fetchCompanies();
  }, [loadingaddCompany]);

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="blue" className="w-full">
            Add a Company
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add a New Company</DrawerTitle>
          </DrawerHeader>
          <form className="px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <Input
              type="text"
              placeholder="company name"
              {...register("name")}
            />

            <label
              htmlFor="logo"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              logo:
            </label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              {...register("logo")}
              className="file:cursor-pointer dark:file:bg-gray-600 file:bg-gray-300 file:p-2 file:rounded-md file:text-sm "
            />

            <Button
              type="button"
              onClick={handleSubmit(onsubmit)}
              variant="blue"
            >
              Add
            </Button>
          </form>
          {errors.name && (
            <p className="text-red-500 text-center">{errors.name.message}</p>
          )}
          {errors.logo && (
            <p className="text-red-500 text-center">{errors.logo.message}</p>
          )}
          {erroraddCompany?.message && (
            <p className="text-red-500 text-center">
              {erroraddCompany?.message}
            </p>
          )}
          {loadingaddCompany && (
            <div className="w-full">
              <BarLoader color="blue" width="100%" />
            </div>
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="destructive">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default Addcompanydrawer;
