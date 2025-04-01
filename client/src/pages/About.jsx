import React from "react";

const About = () => {
  return (
    <div className="h-heightWithoutNavbar flex flex-col items-center justify-start p-5 lg:flex-row">
      <div className="grid h-full w-full place-content-center">
        <img
          src="./aboutUs.svg"
          alt=""
          className="w-[300px] sm:w-[400px]  md:w-[450px] lg:w-[600px]"
        />
      </div>
      <div className="flex h-full  w-full flex-col items-center justify-center">
        <div className="">
          <h1 className="relative w-fit text-2xl font-bold before:absolute before:top-[90%] before:h-[3px] before:w-[60%] before:bg-[#2563eb] lg:text-4xl lg:before:top-full">
            About Us
          </h1>
          <p className="mt-1 text-[15px] lg:mt-3">
            Welcome to CampusNotes, The central spot for easily sharing and finding study notes and resources with fellow students across different colleges.
          </p>
        </div>
        <div className="">
          <h1 className="relative w-fit text-2xl font-bold before:absolute before:top-[90%] before:h-[3px] before:w-[60%] before:bg-[#2563eb] lg:text-4xl lg:before:top-full">
            Why We Built This:
          </h1>
          <p className="mt-1 text-[15px] lg:mt-3">
            CampusNotes started simple, we believe learning gets better when we collaborate. Tired of scattered notes and hard-to-find resources, we decided to build a platform dedicated to making study materials accessible for everyone. We're a mix of students, tech enthusiasts, and education advocates united by the goal of improving the student experience.
          </p>
        </div>
        <div className="">
          <h1 className="relative w-fit text-2xl font-bold before:absolute before:top-[90%] before:h-[3px] before:w-[60%] before:bg-[#2563eb] lg:text-4xl lg:before:top-full">
            Our Mission:
          </h1>
          <p className="mt-1 text-[15px] lg:mt-3">
            It's straightforward, empower students by making knowledge sharing easy. We want to break down barriers so that valuable study guides and notes are just a click away, helping you and your peers succeed academically. Join us in building a smarter, more connected learning community!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
