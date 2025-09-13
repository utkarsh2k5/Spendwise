// "use client";

// import { useState, useEffect } from "react";
// import { Pencil, Check, X } from "lucide-react";
// import useFetch from "@/hooks/use-fetch";
// import { toast } from "sonner";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { updateBudget } from "@/actions/budget";

// export function BudgetProgress({ initialBudget, currentExpenses }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [newBudget, setNewBudget] = useState(
//     initialBudget?.amount?.toString() || ""
//   );

//   const {
//     loading: isLoading,
//     fn: updateBudgetFn,
//     data: updatedBudget,
//     error,
//   } = useFetch(updateBudget);

//   const percentUsed = initialBudget
//     ? (currentExpenses / initialBudget.amount) * 100
//     : 0;

//   const handleUpdateBudget = async () => {
//     const amount = parseFloat(newBudget);

//     if (isNaN(amount) || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }

//     await updateBudgetFn(amount);
//   };

//   const handleCancel = () => {
//     setNewBudget(initialBudget?.amount?.toString() || "");
//     setIsEditing(false);
//   };

//   useEffect(() => {
//     if (updatedBudget?.success) {
//       setIsEditing(false);
//       toast.success("Budget updated successfully");
//     }
//   }, [updatedBudget]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error.message || "Failed to update budget");
//     }
//   }, [error]);

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <div className="flex-1">
//           <CardTitle className="text-sm font-medium">
//             Monthly Budget (Default Account)
//           </CardTitle>
//           <div className="flex items-center gap-2 mt-1">
//             {isEditing ? (
//               <div className="flex items-center gap-2">
//                 <Input
//                   type="number"
//                   value={newBudget}
//                   onChange={(e) => setNewBudget(e.target.value)}
//                   className="w-32"
//                   placeholder="Enter amount"
//                   autoFocus
//                   disabled={isLoading}
//                 />
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleUpdateBudget}
//                   disabled={isLoading}
//                 >
//                   <Check className="h-4 w-4 text-green-500" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleCancel}
//                   disabled={isLoading}
//                 >
//                   <X className="h-4 w-4 text-red-500" />
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <CardDescription>
//                   {initialBudget
//                     ? `$${currentExpenses.toFixed(
//                         2
//                       )} of $${initialBudget.amount.toFixed(2)} spent`
//                     : "No budget set"}
//                 </CardDescription>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setIsEditing(true)}
//                   className="h-6 w-6"
//                 >
//                   <Pencil className="h-3 w-3" />
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {initialBudget && (
//           <div className="space-y-2">
//             <Progress
//               value={percentUsed}
//               extraStyles={`${
//                 // add to Progress component
//                 percentUsed >= 90
//                   ? "bg-red-500"
//                   : percentUsed >= 75
//                     ? "bg-yellow-500"
//                     : "bg-green-500"
//               }`}
//             />
//             <p className="text-xs text-muted-foreground text-right">
//               {percentUsed.toFixed(1)}% used
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-base md:text-lg font-semibold text-emerald-800 dark:text-emerald-400">
            Monthly Budget (Default Account)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                  className="text-green-600 hover:text-green-500"
                >
                  <Check className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription className="text-sm md:text-base text-gray-700 dark:text-gray-400">
                  {initialBudget
                    ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(
                        2
                      )} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 text-gray-900 dark:text-gray-100"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <div className="space-y-2">
            <Progress
              value={percentUsed}
              extraStyles={`${
                percentUsed >= 90
                  ? "bg-red-600"
                  : percentUsed >= 75
                  ? "bg-yellow-500"
                  : "bg-emerald-500"
              }`}
            />
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-right font-semibold">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
