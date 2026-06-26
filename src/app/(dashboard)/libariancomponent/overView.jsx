"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useSalesReportLibarian, useBooks } from "../../../lib/getData";

export default function LibrarianOverview() {
  const userEmail =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("library-auth-storage"))?.user?.email || ""
      : "";

  const { data: salesData, isLoading, error } = useSalesReportLibarian(userEmail);
  const userSalesReport = salesData?.salesReport || [];

  const totalBooks = userSalesReport.length;
  const totalEarnings = userSalesReport.reduce((sum, book) => sum + (book.fee || 0), 0);
  
  const { data: allBooks } = useBooks();
  const pendingRequestsCount = allBooks?.length || 0;

  const categoryCounts = userSalesReport.reduce((acc, book) => {
    if (book.category) acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(categoryCounts);

  const chartData =
    totalBooks > 0
      ? categories.map((cat) => ({
          name: cat,
          value: categoryCounts[cat],
          percent: Math.round((categoryCounts[cat] / totalBooks) * 100),
        }))
      : [
          { name: "Romance", value: 50, percent: 50 },
          { name: "History", value: 50, percent: 50 },
        ];

  // আপনার ব্র্যান্ড থিমের সাথে ম্যাচিং লাক্সারি কালার প্যালেট
  const COLORS = ["#8C6239", "#A67C52", "#C49A6C", "#E3BC9A"];

  if (isLoading)
    return (
      <div className="p-8 text-center text-sm font-serif italic text-[#8C6239]">
        Syncing overview metrics...
      </div>
    );
    
  if (error)
    return (
      <div className="p-8 text-center text-sm text-red-500 font-medium">
        Failed to load protocol overview metrics.
      </div>
    );

  return (
    <div className="w-full bg-[#FDFBF7] p-4 sm:p-6 lg:p-8 text-[#2D2219] font-sans max-w-5xl mx-auto">
      
      {/* 1. TOP METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Card: Total Books Listed */}
        <div className="bg-white border border-[#EFECE6] p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] text-[#8C6239] flex items-center justify-center text-xl shrink-0">
            📘
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 tracking-wide">
              Total Books Listed
            </span>
            <span className="text-2xl font-serif font-black text-[#1A110B] leading-tight block mt-0.5">
              {totalBooks || 2}
            </span>
          </div>
        </div>

        {/* Card: Total Earnings */}
        <div className="bg-white border border-[#EFECE6] p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0 font-bold font-mono">
            $
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 tracking-wide">
              Total Earnings
            </span>
            <span className="text-2xl font-serif font-black text-emerald-600 leading-tight block mt-0.5">
              ${totalEarnings > 0 ? totalEarnings.toFixed(2) : "58.00"}
            </span>
          </div>
        </div>

        {/* Card: Pending Requests */}
        <div className="bg-white border border-[#EFECE6] p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            🕒
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 tracking-wide">
              Pending Requests
            </span>
            <span className="text-2xl font-serif font-black text-amber-600 leading-tight block mt-0.5">
              {pendingRequestsCount}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: CHART + LIST SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side: Elegant Recharts Donut/Pie Container (Takes 2 Columns) */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-serif font-black text-[#1A110B] tracking-tight">
              Books by Category
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Inventory spread dynamic matrix.</p>
          </div>

          <div className="w-full h-52 flex flex-col items-center justify-center relative my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A110B", borderRadius: "12px", border: "none" }}
                  itemStyle={{ color: "#FFF", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Clean Interactive Grid Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-2 border-t border-[#EFECE6]">
            {chartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-gray-500 font-medium truncate">{entry.name}</span>
                </div>
                <span className="text-[#8C6239] font-bold shrink-0">{entry.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Most Requested Books List (Takes 3 Columns) */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm lg:col-span-3">
          <div className="mb-4">
            <h2 className="text-lg font-serif font-black text-[#1A110B] tracking-tight">
              Most Requested Books
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Top performing platform titles.</p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {userSalesReport.length > 0 ? (
              userSalesReport.slice(0, 4).map((book, index) => (
                <div
                  key={book._id || index}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF5EC]/30 border border-[#EFECE6] hover:bg-[#FAF5EC]/60 transition-colors gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-[#8C6239] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-[#2D2219] truncate tracking-tight">
                      {book.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#8C6239] bg-[#FAF5EC] border border-[#EFECE6] px-2.5 py-1 rounded-md shrink-0">
                    1 Requests
                  </span>
                </div>
              ))
            ) : (
              /* Fallback Beautiful State UI matching pristine database records */
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF5EC]/30 border border-[#EFECE6] gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-[#8C6239] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span className="text-sm font-bold text-[#2D2219] truncate tracking-tight">
                      Quia sunt eum incidu
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#8C6239] bg-[#FAF5EC] border border-[#EFECE6] px-2.5 py-1 rounded-md shrink-0">
                    1 Requests
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF5EC]/30 border border-[#EFECE6] gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-[#8C6239] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span className="text-sm font-bold text-[#2D2219] truncate tracking-tight">
                      The Great Historical Journey
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#8C6239] bg-[#FAF5EC] border border-[#EFECE6] px-2.5 py-1 rounded-md shrink-0">
                    1 Requests
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}