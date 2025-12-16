import React, { useRef } from "react";
import Logo from "../components/Logo.jsx";
import Banner from "../assets/banner.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import companies from "../data/companies.json";
import faq from "../data/faq.json";

function LandingPage() {
  const autoplay = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
    })
  );

  return (
    <div>
      <div className="flex flex-col justify-center items-center px-2 mt-20">
        <h1
          className="text-3xl sm:text-5xl
              md:text-7xl font-extrabold text-center
              bg-clip-text text-transparent
              bg-linear-to-r
              from-slate-900 via-slate-700 to-slate-500
              dark:from-slate-100 dark:via-slate-300 dark:to-slate-500"
        >
          Find your dream job
          <span className="mt-4 flex justify-center items-center gap-2 sm:gap-4 md:gap-6">
            with <Logo />
          </span>
        </h1>
        <p className="mt-1 md:mt-4 text-center text-xs sm:text-xl md:text-2xl">
          Explore opportunities or find the perfect candidate - all in one place
        </p>
      </div>
      <div className="mt-14 flex justify-center gap-3 sm:gap-12 items-center  py-4 px-2">
        <Link to="/jobs">
          <Button variant="destructive" size="xl">
            Find Jobs
          </Button>
        </Link>
        <Link to="/post-job">
          <Button variant="blue" size="xl">
            Post a Job
          </Button>
        </Link>
      </div>
      <div className="mt-10">
        <Carousel
          opts={{ loop: true }}
          plugins={[autoplay.current]}
          className="w-full py-10"
        >
          <CarouselContent className="flex items-center">
            {companies.map((item) => (
              <CarouselItem
                key={item.id}
                className="bg-zinc-400 mr-8 ml-8 flex justify-center p-5 basis-1/3 lg:basis-1/6 "
              >
                <img
                  src={item.path}
                  alt={item.name}
                  className="h-9 sm:h-14 object-contain "
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="mt-10 px-4 sm:px-10 py-4">
        <img src={Banner} alt="Banner" className="w-full" />
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-10 px-4 sm:px-10 py-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-base sm:text-2xl">For Job Seekers</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-base">
              Search and apply for jobs, track applications, and more.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-base sm:text-2xl">For Employers</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-base">
              Post jobs, manage applications, and find the best candidates.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-20 px-4 sm:px-10 py-4">
        <h1 className="text-base sm:text-2xl mb-3">FAQs:</h1>
        <Accordion type="single" collapsible>
          {faq.map((item, index) => (
            <div key={index}>
              <AccordionItem value={`item-${index + 1}`}>
                <AccordionTrigger>
                  <h1 className="text-base sm:text-xl">{item.question}</h1>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-xs sm:text-sm"></p>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default LandingPage;
