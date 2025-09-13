// "use server";

// import { auth } from "@clerk/nextjs/server";
// import { db } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import aj from "@/lib/arcjet";
// import { request } from "@arcjet/next";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const serializeAmount = (obj) => ({
//   ...obj,
//   amount: obj.amount.toNumber(),
// });

// // Create Transaction
// export async function createTransaction(data) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     // Get request data for ArcJet
//     const req = await request();

//     // Check rate limit
//     const decision = await aj.protect(req, {
//       userId,
//       requested: 1, // Specify how many tokens to consume
//     });

//     if (decision.isDenied()) {
//       if (decision.reason.isRateLimit()) {
//         const { remaining, reset } = decision.reason;
//         console.error({
//           code: "RATE_LIMIT_EXCEEDED",
//           details: {
//             remaining,
//             resetInSeconds: reset,
//           },
//         });

//         throw new Error("Too many requests. Please try again later.");
//       }

//       throw new Error("Request blocked");
//     }

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     const account = await db.account.findUnique({
//       where: {
//         id: data.accountId,
//         userId: user.id,
//       },
//     });

//     if (!account) {
//       throw new Error("Account not found");
//     }

//     // Calculate new balance
//     const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
//     const newBalance = account.balance.toNumber() + balanceChange;

//     // Create transaction and update account balance
//     const transaction = await db.$transaction(async (tx) => {
//       const newTransaction = await tx.transaction.create({
//         data: {
//           ...data,
//           userId: user.id,
//           nextRecurringDate:
//             data.isRecurring && data.recurringInterval
//               ? calculateNextRecurringDate(data.date, data.recurringInterval)
//               : null,
//         },
//       });

//       await tx.account.update({
//         where: { id: data.accountId },
//         data: { balance: newBalance },
//       });

//       return newTransaction;
//     });

//     revalidatePath("/dashboard");
//     revalidatePath(`/account/${transaction.accountId}`);

//     return { success: true, data: serializeAmount(transaction) };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// export async function getTransaction(id) {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   const transaction = await db.transaction.findUnique({
//     where: {
//       id,
//       userId: user.id,
//     },
//   });

//   if (!transaction) throw new Error("Transaction not found");

//   return serializeAmount(transaction);
// }

// export async function updateTransaction(id, data) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!user) throw new Error("User not found");

//     // Get original transaction to calculate balance change
//     const originalTransaction = await db.transaction.findUnique({
//       where: {
//         id,
//         userId: user.id,
//       },
//       include: {
//         account: true,
//       },
//     });

//     if (!originalTransaction) throw new Error("Transaction not found");

//     // Calculate balance changes
//     const oldBalanceChange =
//       originalTransaction.type === "EXPENSE"
//         ? -originalTransaction.amount.toNumber()
//         : originalTransaction.amount.toNumber();

//     const newBalanceChange =
//       data.type === "EXPENSE" ? -data.amount : data.amount;

//     const netBalanceChange = newBalanceChange - oldBalanceChange;

//     // Update transaction and account balance in a transaction
//     const transaction = await db.$transaction(async (tx) => {
//       const updated = await tx.transaction.update({
//         where: {
//           id,
//           userId: user.id,
//         },
//         data: {
//           ...data,
//           nextRecurringDate:
//             data.isRecurring && data.recurringInterval
//               ? calculateNextRecurringDate(data.date, data.recurringInterval)
//               : null,
//         },
//       });

//       // Update account balance
//       await tx.account.update({
//         where: { id: data.accountId },
//         data: {
//           balance: {
//             increment: netBalanceChange,
//           },
//         },
//       });

//       return updated;
//     });

//     revalidatePath("/dashboard");
//     revalidatePath(`/account/${data.accountId}`);

//     return { success: true, data: serializeAmount(transaction) };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// // Get User Transactions
// export async function getUserTransactions(query = {}) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     const transactions = await db.transaction.findMany({
//       where: {
//         userId: user.id,
//         ...query,
//       },
//       include: {
//         account: true,
//       },
//       orderBy: {
//         date: "desc",
//       },
//     });

//     return { success: true, data: transactions };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// // Scan Receipt
// export async function scanReceipt(file) {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Convert File to ArrayBuffer
//     const arrayBuffer = await file.arrayBuffer();
//     // Convert ArrayBuffer to Base64
//     const base64String = Buffer.from(arrayBuffer).toString("base64");

//     const prompt = `
//       Analyze this receipt image and extract the following information in JSON format:
//       - Total amount (just the number)
//       - Date (in ISO format)
//       - Description or items purchased (brief summary)
//       - Merchant/store name
//       - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
//       Only respond with valid JSON in this exact format:
//       {
//         "amount": number,
//         "date": "ISO date string",
//         "description": "string",
//         "merchantName": "string",
//         "category": "string"
//       }

//       If its not a recipt, return an empty object
//     `;

//     const result = await model.generateContent([
//       {
//         inlineData: {
//           data: base64String,
//           mimeType: file.type,
//         },
//       },
//       prompt,
//     ]);

//     const response = await result.response;
//     const text = response.text();
//     const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

//     try {
//       const data = JSON.parse(cleanedText);
//       return {
//         amount: parseFloat(data.amount),
//         date: new Date(data.date),
//         description: data.description,
//         category: data.category,
//         merchantName: data.merchantName,
//       };
//     } catch (parseError) {
//       console.error("Error parsing JSON response:", parseError);
//       throw new Error("Invalid response format from Gemini");
//     }
//   } catch (error) {
//     console.error("Error scanning receipt:", error);
//     throw new Error("Failed to scan receipt");
//   }
// }

// // Helper function to calculate next recurring date
// function calculateNextRecurringDate(startDate, interval) {
//   const date = new Date(startDate);

//   switch (interval) {
//     case "DAILY":
//       date.setDate(date.getDate() + 1);
//       break;
//     case "WEEKLY":
//       date.setDate(date.getDate() + 7);
//       break;
//     case "MONTHLY":
//       date.setMonth(date.getMonth() + 1);
//       break;
//     case "YEARLY":
//       date.setFullYear(date.getFullYear() + 1);
//       break;
//   }

//   return date;
// }



"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

// A helper function to analyze spending patterns, adapted from main.py
async function getSpendingAnalysis(userId, days = 14) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: fromDate,
      },
    },
    select: {
      amount: true,
      category: true,
    },
  });

  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (transaction.category) {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + transaction.amount.toNumber();
    }
    return acc;
  }, {});

  const totalExpenses = transactions.reduce(
    (acc, t) => acc + t.amount.toNumber(),
    0
  );

  return {
    categoryTotals,
    totalExpenses: totalExpenses,
    avgDailySpending: transactions.length
      ? totalExpenses / transactions.length
      : 0,
    transactionCount: transactions.length,
  };
}

// Helper function to calculate next recurring date
function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}

// Create Transaction
export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // Calculate new balance
    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    // Create transaction and update account balance
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get original transaction to calculate balance change
    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!originalTransaction) throw new Error("Transaction not found");

    // Calculate balance changes
    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    const newBalanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    // Update transaction and account balance in a transaction
    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      // Update account balance
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange,
          },
        },
      });

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get User Transactions
export async function getUserTransactions(query = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        ...query,
      },
      include: {
        account: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return { success: true, data: transactions };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Scan Receipt
export async function scanReceipt(file) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error("Failed to scan receipt");
  }
}


export async function generateNudge() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const analysis = await getSpendingAnalysis(user.id);

    // Don't generate a nudge if there's no recent activity
    if (analysis.transactionCount < 3) {
      return { success: true, data: [] };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      As a friendly financial advisor for a student, analyze the following spending data from the last 14 days and generate one encouraging, actionable nudge.
      The user is on a budget. If spending is high, suggest a specific, small change. If it's low, be encouraging.
      Keep the message concise.
            
      Data:
      - Total Spent: $${analysis.totalExpenses.toFixed(2)}
      - Average Daily Spending: $${analysis.avgDailySpending.toFixed(2)}
      - Spending by Category: ${JSON.stringify(analysis.categoryTotals)}

      Generate a JSON object with "title" and "message".
      Only respond with valid JSON in this exact format:
      {
        "title": "string",
        "message": "string"
      }
      `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const nudge = JSON.parse(cleanedText);
      return { success: true, data: [nudge] };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error generating nudge:", error);
    throw new Error("Failed to generate AI nudge");
  }
}

export async function calculateSavingsScenarios(weeklySavingGoal = 25) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const analysis = await getSpendingAnalysis(user.id);

    const currentWeeklySpend = analysis.avgDailySpending * 7;
    const projectedWeeklySpend = currentWeeklySpend - weeklySavingGoal;

    return {
      success: true,
      data: {
        scenarioDetails: {
          weeklySavingGoal,
          basedOnTransactionsInLastDays: 14,
        },
        currentTrajectory: {
          weeklySpend: parseFloat(currentWeeklySpend.toFixed(2)),
          monthlySpend: parseFloat((currentWeeklySpend * 4.33).toFixed(2)),
          semesterSpend: parseFloat((currentWeeklySpend * 16).toFixed(2)),
        },
        newTrajectoryWithSavings: {
          weeklySpend: parseFloat(projectedWeeklySpend.toFixed(2)),
          monthlySpend: parseFloat((projectedWeeklySpend * 4.33).toFixed(2)),
          semesterSpend: parseFloat((projectedWeeklySpend * 16).toFixed(2)),
        },
        totalSavings: {
          perWeek: weeklySavingGoal,
          perMonth: parseFloat((weeklySavingGoal * 4.33).toFixed(2)),
          perSemester: weeklySavingGoal * 16,
        },
      },
    };
  } catch (error) {
    console.error("Error calculating savings scenario:", error);
    throw new Error("Failed to calculate savings scenario");
  }
}

export async function getCategorySavingsNudge() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const analysis = await getSpendingAnalysis(user.id);
    const categoryTotals = analysis.categoryTotals;

    // Don't generate a nudge if there's no recent activity
    if (analysis.transactionCount < 3) {
      return { success: true, data: [] };
    }

    // Find the category with the highest spending
    const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b,
      null
    );

    // If no transactions have a category, we can't generate a specific nudge
    if (!topCategory) {
      return { success: true, data: [] };
    }

    const overspentAmount = categoryTotals[topCategory];

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      As a friendly financial advisor, analyze the following spending data and generate a "what-if" scenario focusing on the top spending category.
      The user is on a budget.
      
      Data:
      - Top spending category: ${topCategory}
      - Total spent in that category: $${overspentAmount.toFixed(2)}
      - Total expenses over the last 14 days: $${analysis.totalExpenses.toFixed(2)}
      
      Generate a JSON object with "title" and "message". The message should propose a specific, small reduction in the overspent category and explain how that would lower the total monthly expenses. Be encouraging and concise.
      
      Only respond with valid JSON in this exact format:
      {
        "title": "string",
        "message": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const nudge = JSON.parse(cleanedText);
      return { success: true, data: [nudge] };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error generating category savings nudge:", error);
    throw new Error("Failed to generate category savings nudge");
  }
}