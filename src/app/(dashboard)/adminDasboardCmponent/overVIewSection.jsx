"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAdminBooks, useUsers, useAllSalesReport } from "../../../lib/getData";

const COLORS = ["#8C6239", "#A67C52", "#C49A6C", "#E3BC9A"];

export default function AdminDashboard() {
  const { data: allbooks = [] } = useAdminBooks();
  const { data: users = [] } = useUsers();
  const { data: salesData } = useAllSalesReport();

  const salesLedger = salesData?.salesLedger || [];

  // ✅ derived values (safe + memoized)
  const totalTransactions = salesData?.totalData ?? salesLedger?.length;

  const totalAmount = useMemo(() => {
    return salesLedger.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [salesLedger]);

  const totalBook = allbooks.length;
  const totalUser = users.length;

  const stats = {
    totalUsers: totalUser,
    totalBooks: totalBook,
    totalDeliveries: totalTransactions,
    totalRevenue: totalAmount,
  };

  // ⚠️ FIXED: cleaner chart structure
  const categoryData = [
    { name: "Books", value: totalBook },
    { name: "Users", value: totalUser },
    { name: "Transactions", value: totalTransactions },
    { name: "Revenue", value: totalAmount },
  ];

  return (
    <div className="w-full bg-[#FDFBF7] p-4 sm:p-6 lg:p-8 text-[#2D2219] font-sans">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-black text-[#1A110B]">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Platform-wide overview and analytics.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Books" value={stats.totalBooks} />
        <StatCard label="Total Transactions" value={stats.totalDeliveries} />
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
        />

      </div>

      {/* CHARTS */}
      <div className="bg-white border border-[#EFECE6] p-6 rounded-3xl">

        <h2 className="text-lg font-serif font-bold mb-4">
          Platform Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* BAR CHART */}
          <div className="lg:col-span-2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8C6239" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="h-[300px] flex flex-col items-center">

            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* LEGEND */}
            <div className="flex flex-wrap gap-3 text-xs mt-2">
              {categoryData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  {item.name}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* SMALL REUSABLE COMPONENT */
function StatCard({ label, value }) {
  return (
    <div className="bg-white border p-5 rounded-2xl shadow-sm">
      <p className="text-xs text-gray-400">{label}</p>
      <h3 className="text-2xl font-bold text-[#1A110B] mt-1">
        {value}
      </h3>
    </div>
  );
}