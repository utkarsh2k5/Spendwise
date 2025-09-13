// "use client";

// import { useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { format } from "date-fns";
// import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// const COLORS = [
//   "#FF6B6B",
//   "#4ECDC4",
//   "#45B7D1",
//   "#96CEB4",
//   "#FFEEAD",
//   "#D4A5A5",
//   "#9FA8DA",
// ];

// export function DashboardOverview({ accounts, transactions }) {
//   const [selectedAccountId, setSelectedAccountId] = useState(
//     accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
//   );

//   // Filter transactions for selected account
//   const accountTransactions = transactions.filter(
//     (t) => t.accountId === selectedAccountId
//   );

//   // Get recent transactions (last 5)
//   const recentTransactions = accountTransactions
//     .sort((a, b) => new Date(b.date) - new Date(a.date))
//     .slice(0, 5);

//   // Calculate expense breakdown for current month
//   const currentDate = new Date();
//   const currentMonthExpenses = accountTransactions.filter((t) => {
//     const transactionDate = new Date(t.date);
//     return (
//       t.type === "EXPENSE" &&
//       transactionDate.getMonth() === currentDate.getMonth() &&
//       transactionDate.getFullYear() === currentDate.getFullYear()
//     );
//   });

//   // Group expenses by category
//   const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
//     const category = transaction.category;
//     if (!acc[category]) {
//       acc[category] = 0;
//     }
//     acc[category] += transaction.amount;
//     return acc;
//   }, {});

//   // Format data for pie chart
//   const pieChartData = Object.entries(expensesByCategory).map(
//     ([category, amount]) => ({
//       name: category,
//       value: amount,
//     })
//   );

//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       {/* Recent Transactions Card */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//           <CardTitle className="text-base font-normal">
//             Recent Transactions
//           </CardTitle>
//           <Select
//             value={selectedAccountId}
//             onValueChange={setSelectedAccountId}
//           >
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Select account" />
//             </SelectTrigger>
//             <SelectContent>
//               {accounts.map((account) => (
//                 <SelectItem key={account.id} value={account.id}>
//                   {account.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {recentTransactions.length === 0 ? (
//               <p className="text-center text-muted-foreground py-4">
//                 No recent transactions
//               </p>
//             ) : (
//               recentTransactions.map((transaction) => (
//                 <div
//                   key={transaction.id}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="space-y-1">
//                     <p className="text-sm font-medium leading-none">
//                       {transaction.description || "Untitled Transaction"}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       {format(new Date(transaction.date), "PP")}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={cn(
//                         "flex items-center",
//                         transaction.type === "EXPENSE"
//                           ? "text-red-500"
//                           : "text-green-500"
//                       )}
//                     >
//                       {transaction.type === "EXPENSE" ? (
//                         <ArrowDownRight className="mr-1 h-4 w-4" />
//                       ) : (
//                         <ArrowUpRight className="mr-1 h-4 w-4" />
//                       )}
//                       ${transaction.amount.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Expense Breakdown Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-base font-normal">
//             Monthly Expense Breakdown
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-0 pb-5">
//           {pieChartData.length === 0 ? (
//             <p className="text-center text-muted-foreground py-4">
//               No expenses this month
//             </p>
//           ) : (
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={pieChartData}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                     label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
//                   >
//                     {pieChartData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     formatter={(value) => `$${value.toFixed(2)}`}
//                     contentStyle={{
//                       backgroundColor: "hsl(var(--popover))",
//                       border: "1px solid hsl(var(--border))",
//                       borderRadius: "var(--radius)",
//                     }}
//                   />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#EF4444", // Red 500
  "#10B981", // Emerald 500
  "#3B82F6", // Blue 500
  "#F59E0B", // Amber 500
  "#8B5CF6", // Violet 500
  "#EC4899", // Pink 500
  "#14B8A6", // Teal 500
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  // Filter transactions for selected account
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  // Get recent transactions (last 5)
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 font-sans text-gray-900 dark:text-gray-100">
      {/* Recent Transactions Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
            Recent Transactions
          </CardTitle>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[160px] bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-md px-3 py-2"
                >
                  <div className="space-y-1">
                    <p className="text-base font-medium leading-none">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex items-center font-semibold gap-1",
                      transaction.type === "EXPENSE"
                        ? "text-red-500 dark:text-red-400"
                        : "text-green-500 dark:text-green-400"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownRight className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-6">
          {pieChartData.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No expenses this month
            </p>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) =>
                      `${name}: $${value.toFixed(2)}`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: "hsl(var(--foreground))",
                      fontWeight: "600",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
