"use client";

import React, { useEffect, useState } from "react";
import { useAllSalesReport } from "../../../lib/getData";
import { getSession } from "@/lib/auth-client";

export default function OverViewSection() {
  console.log("overView call");
  const [userEmail, setUserEmail] = useState("");
  const [isSessionLoading, setIsSessionLoading] = useState(true); // ✅ নতুন

  useEffect(() => {
    const loadSession = async () => {
      const currentUserEmail =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("library-auth-storage"))?.user
              ?.email || ""
          : "";
      console.log("currentUserEmail", currentUserEmail);
      setUserEmail(currentUserEmail);
      setIsSessionLoading(false); // ✅ session load শেষ
    };

    loadSession();
  }, []);

  const { data: PendingData, isLoading: isSalesLoading } = useAllSalesReport();
  const salesLedgerArray = PendingData?.salesLedger || [];
  const userAllOrders = salesLedgerArray.filter(
    (item) => item?.userEmail === userEmail,
  );

  console.log("DEBUG userAllOrders length:", userAllOrders.length);

  const completedOrders = userAllOrders.filter(
    (item) => (item?.status || "").toLowerCase() === "completed",
  );

  const pendingOrders = userAllOrders.filter(
    (item) => (item?.status || "").toLowerCase() !== "completed",
  );

  const booksReadCount = completedOrders.length;
  const finalPendingCount = pendingOrders.length;

  const totalSpentAmount = userAllOrders.reduce(
    (sum, item) => sum + Number(item?.amount || 0),
    0,
  );

  const formattedTotalSpent = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalSpentAmount);

  // ✅ session আর sales report — দুটোই শেষ না হওয়া পর্যন্ত loading দেখাবে
  if (isSessionLoading || isSalesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-pulse text-[#8C6239] text-lg font-serif italic">
          Synchronizing library database...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2219] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Books Read */}
          <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-sm flex items-center gap-5 transition-all duration-200 hover:shadow-md">
            <div className="w-14 h-14 rounded-xl bg-[#FAF5EC] border border-[#EFECE6] flex items-center justify-center text-[#8C6239] shrink-0">
              <svg
                className="w-6 h-6 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                Books Read
              </p>
              <p className="text-3xl font-serif font-black text-[#2D2219]">
                {booksReadCount}
              </p>
            </div>
          </div>

          {/* Card 2: Pending Deliveries */}
          <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-sm flex items-center gap-5 transition-all duration-200 hover:shadow-md">
            <div className="w-14 h-14 rounded-xl bg-[#FAF5EC] border border-[#EFECE6] flex items-center justify-center text-amber-600 shrink-0">
              <svg
                className="w-6 h-6 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011-1v2a1 1 0 01-1 1m0-4h3m-11 4h7m10-4h-3M16 9h4l3 3v4a1 1 0 01-1 1h-1"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                Pending Deliveries
              </p>
              <p className="text-3xl font-serif font-black text-[#2D2219]">
                {finalPendingCount}
              </p>
            </div>
          </div>

          {/* Card 3: Total Amount */}
          <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-sm flex items-center gap-5 transition-all duration-200 hover:shadow-md">
            <div className="w-14 h-14 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <svg
                className="w-6 h-6 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 11h4"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                Total Amount
              </p>
              <p className="text-3xl font-serif font-black text-emerald-600">
                {formattedTotalSpent}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Reading Activity */}
        <div className="w-full bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="mb-8 pb-4 border-b border-[#EFECE6]">
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#2D2219]">
              Monthly Reading Activity
            </h2>
          </div>

          {booksReadCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-[#EFECE6] rounded-2xl bg-[#FAF5EC]/30">
              <div className="w-12 h-12 rounded-full bg-[#FAF5EC] border border-[#EFECE6] flex items-center justify-center mb-4 text-[#8C6239]">
                <svg
                  className="w-5 h-5 stroke-current fill-none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-400 text-center max-w-sm leading-relaxed">
                No reading activity yet. Start requesting book deliveries!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                Active Reading List ({booksReadCount} Items)
              </p>
              {completedOrders.map((item, index) => (
                <div
                  key={item?._id || index}
                  className="flex justify-between items-center p-4 bg-[#FAF5EC]/40 border border-[#EFECE6] rounded-xl text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-[#2D2219]">
                      {item?.book?.title ||
                        item?.bookTitle ||
                        `Book #${String(item?.bookId).slice(-6)}`}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      Completed on{" "}
                      {item?.completedAt
                        ? new Date(item.completedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-md uppercase">
                    ${Number(item?.amount || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
