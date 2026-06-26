"use client";

import React, { useState } from "react";
import OverVIewSection from "./overVIewSection";
import BookApprovalSection from "./bookApprovalSection";
import TransactionSection from "./transactionSection";
import ManageBookSection from "./manageBookSection";
import MangeUserSection from "./mangeUserSection";
import HeaderSection from "../../component/headerSection";

export default function AdminBookApprovals() {
  const [activeMenu, setActiveMenu] = useState("Overview");

  return (
    <>
      <HeaderSection></HeaderSection>
      <div className="bg-[#FDFBF7] text-[#2D2219] font-sans flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#EFECE6] p-6 flex flex-col gap-8 shrink-0">
          {/* Admin Profile Card (image_716d8a.png অনুযায়ী) */}
          <div className="bg-[#FAF5EC]/60 border border-[#EFECE6] rounded-2xl p-4 text-center flex flex-col items-center">
            <div className="w-14 h-14 bg-gray-200 rounded-full mb-3 overflow-hidden flex items-center justify-center text-gray-500 border-2 border-white shadow-sm">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-sm text-[#2D2219]">Admin</h3>
            <p className="text-xs text-gray-400 mb-2">admin@gmail.com</p>
            <span className="text-[10px] uppercase tracking-widest bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full font-bold">
              Admin
            </span>
          </div>

          {/* Sidebar Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {[
              {
                name: "Overview",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>
                ),
              },
              {
                name: "Book Approvals",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                name: "Manage Users",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
              },
              {
                name: "Manage Books",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                ),
              },
              {
                name: "Transactions",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  activeMenu === item.name
                    ? "bg-[#EEEDFC] text-[#5B52E3]"
                    : "text-gray-500 hover:bg-[#FAF5EC] hover:text-[#2D2219]"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-grow p-6 sm:p-10 max-w-6xl">
          {activeMenu === "Overview" && <OverVIewSection />}
          {activeMenu === "Book Approvals" && <BookApprovalSection />}
          {activeMenu === "Manage Users" && <MangeUserSection />}
          {activeMenu === "Manage Books" && <ManageBookSection />}
          {activeMenu === "Transactions" && <TransactionSection />}
        </main>
      </div>
    </>
  );
}
