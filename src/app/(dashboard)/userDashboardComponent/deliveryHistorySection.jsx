"use client";

import React, { useEffect, useState } from "react";
import { useGetReadingList } from "../../../lib/getData";

export default function ReadingListSection() {
  const [useremail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("library-auth-storage"));

    setUserEmail(storedUser?.user?.email || "");
  }, []);

  // ✅ user reading list
  const { data, isLoading } = useGetReadingList(useremail);

  // ✅ api data
  const readingList = data?.message || [];

  // ✅ loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#8C6239] animate-pulse">Loading Reading List...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] p-4 sm:p-6 rounded-3xl">
      {/* heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#2D2219]">
          My Delivery Status
        </h1>

        <p className="text-sm text-gray-500">
          Track your book delivery progress
        </p>
      </div>

      {/* empty */}
      {readingList.length === 0 ? (
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-10 text-center">
          <p className="text-gray-500">No Orders Found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {readingList.map((item, index) => (
            <div
              key={item._id}
              className="bg-white border border-[#EFECE6] rounded-2xl p-5 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                {/* left */}
                <div className="flex items-start gap-4">
                  {/* number */}
                  <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] border border-[#EFECE6] flex items-center justify-center font-black text-[#8C6239]">
                    {index + 1}
                  </div>

                  {/* info */}
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-[#2D2219]">
                      Book Order
                    </h2>

                    <p className="text-sm text-gray-500 break-all">
                      {item.paymentId}
                    </p>

                    {/* status */}
                    <div className="flex flex-wrap gap-3">
                      {/* pending */}
                      {item.status === "pending" && (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm font-semibold capitalize">
                          Pending Approval
                        </span>
                      )}

                      {/* approved */}
                      {item.status === "approved" && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold capitalize">
                          Approved By Librarian
                        </span>
                      )}

                      {/* dispatched */}
                      {item.status === "dispatched" && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-semibold capitalize">
                          Out For Delivery
                        </span>
                      )}

                      {/* completed */}
                      {item.status === "completed" && (
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-semibold capitalize">
                          Delivered Successfully
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className="flex items-center gap-3">
                  {/* amount */}
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Amount</p>

                    <p className="text-lg font-black text-[#8C6239]">
                      ${item.amount}
                    </p>
                  </div>

                  {/* date */}
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Order Date</p>

                    <p className="text-sm font-medium text-[#2D2219]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* progress line */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Pending</span>
                  <span>Approved</span>
                  <span>Delivery</span>
                  <span>Completed</span>
                </div>

                <div className="w-full h-2 bg-[#EFECE6] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === "pending"
                        ? "w-[25%] bg-yellow-500"
                        : item.status === "approved"
                          ? "w-[50%] bg-blue-500"
                          : item.status === "dispatched"
                            ? "w-[75%] bg-purple-500"
                            : "w-full bg-emerald-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
