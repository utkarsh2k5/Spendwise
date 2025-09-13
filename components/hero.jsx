// "use client";

// import React, { useEffect, useRef } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// const HeroSection = () => {
//   const imageRef = useRef(null);

//   useEffect(() => {
//     const imageElement = imageRef.current;

//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       const scrollThreshold = 100;

//       if (scrollPosition > scrollThreshold) {
//         imageElement.classList.add("scrolled");
//       } else {
//         imageElement.classList.remove("scrolled");
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <section className="pt-40 pb-20 px-4">
//       <div className="container mx-auto text-center">
//         <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
//           Smart AI Expense Buddy: Effortless money management, personalized insights,  <br /> and proactive savings—built just for students.
//         </h1>
//         <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//           An Automated Exense management platform that helps you track,
//           analyze, and optimize your spending with real-time insights.
//         </p>
//         <div className="flex justify-center space-x-4">
//           <Link href="/dashboard">
//             <Button size="lg" className="px-8">
//               Get Started
//             </Button>
//           </Link>
//           <Link href="https://www.youtube.com/roadsidecoder">
//             <Button size="lg" variant="outline" className="px-8">
//               Create a account to Get started.
//             </Button>
//           </Link>
//         </div>
//         <div className="hero-image-wrapper mt-5 md:mt-0">
//           <div ref={imageRef} className="hero-image">
//             <Image
//               src="/banner.jpeg"
//               width={1280}
//               height={720}
//               alt="Dashboard Preview"
//               className="rounded-lg shadow-2xl border mx-auto"
//               priority
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (imageElement) {
        if (scrollPosition > scrollThreshold) {
          imageElement.classList.add("scrolled");
        } else {
          imageElement.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-20 pb-10 px-4 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800">
      <div className="container mx-auto text-center">
        <br />
        <br />
        <h1 className="text-2xl md:text-5xl lg:text-6xl pb-4 font-bold bg-gradient-to-r from-indigo-400 via-indigo-600 to-slate-400 bg-clip-text text-transparent drop-shadow leading-tight">
          <span className="block text-indigo-300">Smart AI Expense Buddy: <br /></span>
          Effortless money management,
          personalized insights, and proactive savings—
          <span className="block text-indigo-300">built just for students.</span>
        </h1>
        <p className="text-base md:text-lg text-gray-400 mb-6 max-w-2xl mx-auto font-medium">
          An Automated Expense management platform that helps you track, analyze, and optimize your spending with real-time insights.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-3 mb-6">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 py-3 bg-indigo-700 text-white font-semibold rounded-xl shadow hover:bg-indigo-800 hover:scale-105 transition-transform">
              Get Started
            </Button>
          </Link>
          <Link href="https://www.youtube.com/roadsidecoder">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 bg-slate-900 text-indigo-300 font-semibold border-2 border-indigo-400 rounded-xl shadow hover:bg-slate-800 hover:scale-105 transition-transform"
            >
              Create an account to Get started.
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-8">
          <div ref={imageRef} className="hero-image transition-shadow duration-500">
            <Image
              src="/img1.jpg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-2xl shadow-2xl border-4 border-indigo-500 mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

