// import React from "react";
// import { Button } from "./ui/button";
// import { PenBox, LayoutDashboard } from "lucide-react";
// import Link from "next/link";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
// import { checkUser } from "@/lib/checkUser";

// const Header = async () => {
//   await checkUser();

//   return (
//     <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
//       <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
//         {/* Brand Name instead of logo */}
//         <Link href="/" className="text-2xl font-bold text-orange-600 tracking-wide">
//           SpendWise
//         </Link>

//         {/* Navigation Links - Different for signed in/out users */}
//         <div className="hidden md:flex items-center space-x-8">
//           <SignedOut>
//             <a href="#features" className="text-gray-600 hover:text-blue-600">
//               Features
//             </a>
//             <a
//               href="#testimonials"
//               className="text-gray-600 hover:text-blue-600"
//             >
//               Testimonials
//             </a>
//           </SignedOut>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center space-x-4">
//           <SignedIn>
//             <Link
//               href="/dashboard"
//               className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
//             >
//               <Button variant="outline">
//                 <LayoutDashboard size={18} />
//                 <span className="hidden md:inline">Dashboard</span>
//               </Button>
//             </Link>
//             <a href="/transaction/create">
//               <Button className="flex items-center gap-2">
//                 <PenBox size={18} />
//                 <span className="hidden md:inline">Add Transaction</span>
//               </Button>
//             </a>
//           </SignedIn>
//           <SignedOut>
//             <SignInButton forceRedirectUrl="/dashboard">
//               <Button variant="outline">Login</Button>
//             </SignInButton>
//           </SignedOut>
//           <SignedIn>
//             <UserButton
//               appearance={{
//                 elements: {
//                   avatarBox: "w-10 h-10",
//                 },
//               }}
//             />
//           </SignedIn>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-emerald-300 shadow">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand Name - left corner */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-serif font-extrabold bg-gradient-to-r from-emerald-700 via-indigo-700 to-slate-700 bg-clip-text text-transparent tracking-wider"
        >
          SpendWise
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
            <a href="#features" className="text-slate-700 hover:text-indigo-700 font-semibold transition-colors">
              Features
            </a>
            <a
              href="#testimonials"
              className="text-slate-700 hover:text-indigo-700 font-semibold transition-colors"
            >
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Right: Actions and avatar */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-medium tracking-wide text-base px-5 py-2 flex items-center"
              >
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <a href="/transaction/create">
              <Button className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-base px-6 py-2 flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </a>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                className="border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-medium text-base px-5 py-2 tracking-wide"
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;

