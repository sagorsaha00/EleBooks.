"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { useSalesReportLibarian } from "../../../lib/getData";

export default function LibrarianOverview() {
  const userEmail =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("library-auth-storage"))?.user?.email ||
        ""
      : "";

  const {
    data: salesData,
    isLoading,
    error,
  } = useSalesReportLibarian(userEmail);

  const userSalesReport = salesData?.salesReport || [];

  // TOTALS
  const totalOrders = userSalesReport.length;

  const totalEarnings = userSalesReport.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  const completedOrders = userSalesReport.filter(
    (item) => item.status === "completed",
  ).length;

  // GROUP SALES BY BOOK
  const groupedBooks = {};

  userSalesReport.forEach((item) => {
    const key = item.bookId;

    if (!groupedBooks[key]) {
      groupedBooks[key] = {
        bookId: item.bookId,
        sales: 0,
      };
    }

    groupedBooks[key].sales += 1;
  });

  const chartData = Object.values(groupedBooks).map((item) => ({
    name: item.bookId.slice(-5),
    value: item.sales,
    percent: Math.round((item.sales / totalOrders) * 100),
  }));

  const COLORS = ["#8C6239", "#A67C52", "#C49A6C", "#E3BC9A"];

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm font-serif italic text-[#8C6239]">
        Syncing overview metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-sm text-red-500 font-medium">
        Failed to load protocol overview metrics.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FDFBF7] p-4 sm:p-6 lg:p-8 text-[#2D2219] font-sans max-w-5xl mx-auto">
      {/* TOP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* TOTAL ORDERS */}
        <div className="bg-white border border-[#EFECE6] p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] text-[#8C6239] flex items-center justify-center text-xl shrink-0">
            📚
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-400 tracking-wide">
              Total Orders
            </span>

            <span className="text-2xl font-serif font-black text-[#1A110B] leading-tight block mt-0.5">
              {totalOrders}
            </span>
          </div>
        </div>

        {/* EARNINGS */}
        <div className="bg-white border border-[#EFECE6] p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0 font-bold">
            $
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-400 tracking-wide">
              Total Earnings
            </span>

            <span className="text-2xl font-serif font-black text-emerald-600 leading-tight block mt-0.5">
              ${totalEarnings.toFixed(2)}
            </span>
          </div>
        </div>

        {/* COMPLETED */}
        <div className="bg-white border border-[#EFECE6] p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            ✅
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-400 tracking-wide">
              Completed Orders
            </span>

            <span className="text-2xl font-serif font-black text-amber-600 leading-tight block mt-0.5">
              {completedOrders}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* PIE CHART */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-serif font-black text-[#1A110B] tracking-tight">
              Sales Distribution
            </h2>

            <p className="text-xs text-gray-400 mt-0.5">
              Book sales performance matrix.
            </p>
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
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A110B",
                    borderRadius: "12px",
                    border: "none",
                  }}
                  itemStyle={{
                    color: "#FFF",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LEGEND */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-2 border-t border-[#EFECE6]">
            {chartData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="text-gray-500 font-medium truncate">
                    {entry.name}
                  </span>
                </div>

                <span className="text-[#8C6239] font-bold shrink-0">
                  {entry.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SALES LIST */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm lg:col-span-3">
          <div className="mb-4">
            <h2 className="text-lg font-serif font-black text-[#1A110B] tracking-tight">
              Recent Sales
            </h2>

            <p className="text-xs text-gray-400 mt-0.5">
              Latest completed transactions.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {userSalesReport.length > 0 ? (
              userSalesReport.map((sale, index) => (
                <div
                  key={sale._id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF5EC]/30 border border-[#EFECE6] hover:bg-[#FAF5EC]/60 transition-colors gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-[#8C6239] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <span className="text-sm font-bold text-[#2D2219] truncate tracking-tight block">
                        Book ID: {sale.bookId}
                      </span>

                      <span className="text-xs text-gray-400 truncate block">
                        {sale.userEmail}
                      </span>

                      <span className="text-[11px] text-gray-400">
                        {new Date(sale.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-emerald-600 block">
                      ${sale.amount}
                    </span>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                        sale.status === "completed"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-sm text-gray-400">
                No sales data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
