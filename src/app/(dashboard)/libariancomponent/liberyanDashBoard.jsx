"use client";

import React, { useState } from "react";
import OverView from "./overView";
import AddBook from "./addBook";
import ManageInventory from "./manageInventory";
import ManageDelivery from "./manageDelivery";
import HeaderSection from "../../component/headerSection";
export default function LibrarianDashboard() {
  const [activeMenu, setActiveMenu] = useState("Manage Inventory");

  return (
    <>
      <HeaderSection />
      <div className=" bg-[#FDFBF7] text-[#2D2219] font-sans flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#EFECE6] p-6 flex flex-col gap-8 shrink-0">
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
            <h3 className="font-bold text-sm text-[#2D2219]">
              James Rodriguez
            </h3>
            <p className="text-xs text-gray-400 mb-2">
              james@heritagebooks.com
            </p>
            <span className="text-[10px] uppercase tracking-widest bg-[#8C6239]/10 text-[#8C6239] px-2.5 py-0.5 rounded-full font-bold">
              Librarian
            </span>
          </div>
          <nav className="flex flex-col gap-1.5 ">
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
                name: "Add Book",
                icon: (
                  <svg
                    className="w-4 h-4 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                ),
              },
              {
                name: "Manage Inventory",
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
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                ),
              },
              {
                name: "Manage Deliveries",
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
                      d="M8.25 18.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18.75 18.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM4.5 5.25h11.25V15h-11.25V5.25ZM15.75 9h3.75l1.5 3v3h-5.25V9Z"
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

        <main className="flex-grow p-6 sm:p-10 max-w-5xl">
          {activeMenu === "Manage Inventory" && <ManageInventory />}
          {activeMenu === "Add Book" && <AddBook />}
          {activeMenu === "Overview" && <OverView />}
          {activeMenu === "Manage Deliveries" && <ManageDelivery />}
        </main>
      </div>
    </>
  );
}
