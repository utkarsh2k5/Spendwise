// "use client";

// import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
// import { useEffect } from "react";
// import useFetch from "@/hooks/use-fetch";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import Link from "next/link";
// import { updateDefaultAccount } from "@/actions/account";
// import { toast } from "sonner";

// export function AccountCard({ account }) {
//   const { name, type, balance, id, isDefault } = account;

//   const {
//     loading: updateDefaultLoading,
//     fn: updateDefaultFn,
//     data: updatedAccount,
//     error,
//   } = useFetch(updateDefaultAccount);

//   const handleDefaultChange = async (event) => {
//     event.preventDefault(); // Prevent navigation

//     if (isDefault) {
//       toast.warning("You need atleast 1 default account");
//       return; // Don't allow toggling off the default account
//     }

//     await updateDefaultFn(id);
//   };

//   useEffect(() => {
//     if (updatedAccount?.success) {
//       toast.success("Default account updated successfully");
//     }
//   }, [updatedAccount]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error.message || "Failed to update default account");
//     }
//   }, [error]);

//   return (
//     <Card className="hover:shadow-md transition-shadow group relative">
//       <Link href={`/account/${id}`}>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium capitalize">
//             {name}
//           </CardTitle>
//           <Switch
//             checked={isDefault}
//             onClick={handleDefaultChange}
//             disabled={updateDefaultLoading}
//           />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">
//             ${parseFloat(balance).toFixed(2)}
//           </div>
//           <p className="text-xs text-muted-foreground">
//             {type.charAt(0) + type.slice(1).toLowerCase()} Account
//           </p>
//         </CardContent>
//         <CardFooter className="flex justify-between text-sm text-muted-foreground">
//           <div className="flex items-center">
//             <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
//             Income
//           </div>
//           <div className="flex items-center">
//             <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
//             Expense
//           </div>
//         </CardFooter>
//       </Link>
//     </Card>
//   );
// }
"use client";

import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-lg transition-shadow group relative bg-white dark:bg-gray-800 rounded-lg">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base md:text-lg font-semibold capitalize text-emerald-800 dark:text-emerald-400">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        </CardHeader>
        <CardContent className="py-2">
          <div className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm md:text-base text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
            <ArrowUpRight className="h-5 w-5" />
            Income
          </div>
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
            <ArrowDownRight className="h-5 w-5" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
