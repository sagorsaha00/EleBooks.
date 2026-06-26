"use client";

import React, { useEffect, useState } from "react";
import { useGetReadingList } from "../../../lib/getData";

export default function ReadingListSection() {
  const [useremail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("library-auth-storage"));

    setUserEmail(storedUser?.user?.email || "");
  }, []);

  const { data, isLoading } = useGetReadingList(useremail);

  const readingList = data?.message || [];

  // loading
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
        <h1 className="text-3xl font-black text-[#2D2219]">My Reading List</h1>

        <p className="text-sm text-gray-500">Purchased books history</p>
      </div>

      {/* empty */}
      {readingList.length === 0 ? (
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-10 text-center">
          <p className="text-gray-500">No Reading List Found</p>
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
                      Payment Record
                    </h2>

                    <p className="text-sm text-gray-500 break-all">
                      {item.paymentId}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="bg-[#FAF5EC] px-3 py-1 rounded-lg text-[#8C6239] font-medium">
                        ${item.amount}
                      </span>

                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg capitalize font-medium">
                        {item.status}
                      </span>

                      <span className="bg-[#F5F5F5] px-3 py-1 rounded-lg text-gray-600">
                        {item.currency.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Purchase Date</p>

                    <p className="text-sm font-medium text-[#2D2219]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button className="bg-[#8C6239] hover:bg-[#734f2d] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all">
                    Read
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
