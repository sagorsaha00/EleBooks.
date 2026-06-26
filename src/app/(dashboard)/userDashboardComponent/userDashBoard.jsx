"use client";

import React, { useState } from "react";
import OverViewSection from "../userDashboardComponent/overViewSection";
import ReadingListSection from "../userDashboardComponent/readingListSection";
import WihslistSection from "../userDashboardComponent/wihslistSection";
import DeliveryHistorySection from "../userDashboardComponent/deliveryHistorySection";
import MyReviewsSection from "../userDashboardComponent/myReviewsSection";
import HeaderSection from "../../component/headerSection";

export default function UserDashboard() {
  const [activeMenu, setActiveMenu] = useState("Overview");

  return (
    <>
      <HeaderSection />
      <div className="bg-[#FDFBF7] text-[#2D2219] font-sans flex flex-col md:flex-row">
        {/* ---------------- LEFT SIDEBAR SECTION ---------------- */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#EFECE6] p-6 flex flex-col gap-8 shrink-0">
          {/* User Profile Card (image_70f601.png অনুযায়ী) */}
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
            <h3 className="font-bold text-sm text-[#2D2219]">Derek Peters</h3>
            <p className="text-xs text-gray-400 mb-2">a@b.com</p>
            <span className="text-[10px] uppercase tracking-widest bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-bold">
              User
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
                name: "Delivery History",
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                ),
              },
              {
                name: "Reading List",
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
                name: "My Reviews",
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
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.365 1.24a1 1 0 01-.784 1.117l-3.974 2.887a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.974-2.887a1 1 0 00-1.176 0l-3.974 2.887c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.493 10.51a1 1 0 01.784-1.117h4.907a1 1 0 00.95-.69l1.519-4.674z"
                    />
                  </svg>
                ),
              },
              {
                name: "Wishlist",
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                ),
              },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${
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

        <main className="flex-grow p-6 sm:p-10 max-w-5xl">
          {/* CONDITION 1: OVERVIEW VIEW */}
          {activeMenu === "Overview" && <OverViewSection />}

          {/* OTHER MENUS ROUTING PLACEHOLDERS */}
          {activeMenu === "Delivery History" && <DeliveryHistorySection />}
          {activeMenu === "Wishlist" && <WihslistSection />}
          {activeMenu === "My Reviews" && <MyReviewsSection />}
          {activeMenu === "Reading List" && <ReadingListSection />}
        </main>
      </div>
    </>
  );
}
