"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function TransactionSection() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from local API
    fetch("https://book-appoitment-backend-server.vercel.app/books/getTransactionId")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        if (result.success) {
          setTransactions(result.data || []);
        } else {
          setError("Failed to load transactions.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2219] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-10 shadow-sm">
        {/* ─── HEADER SECTION ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFECE6] pb-6 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#2D2219]">
              Transaction History
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              View and manage your recent library payment records
            </p>
          </div>

          <span className="self-start sm:self-center bg-[#FAF5EC] text-[#8C6239] border border-[#EFECE6] text-xs font-bold px-4 py-1.5 rounded-xl uppercase tracking-wider">
            {transactions.length} Total Records
          </span>
        </div>

        {/* ─── LOADING STATE ─── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-pulse text-[#8C6239] text-sm italic">
              Retrieving payment ledger...
            </div>
          </div>
        )}

        {/* ─── ERROR STATE ─── */}
        {error && (
          <div className="bg-red-50/60 border border-red-100 text-red-600 p-5 rounded-2xl text-sm text-center font-medium">
            ⚠️ System Error: {error}
          </div>
        )}

        {/* ─── DATA LIST SECTION ─── */}
        {!loading && !error && (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-[#EFECE6] rounded-2xl bg-[#FAF5EC]/30">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EC] border border-[#EFECE6] flex items-center justify-center mb-4 text-[#8C6239]">
                  <CreditCard size={20} />
                </div>
                <p className="text-sm font-medium text-gray-400 text-center max-w-sm leading-relaxed">
                  No payment records found on this account.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {transactions.map((tx, index) => (
                  <div
                    key={tx?._id || index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#FAF5EC]/30 hover:bg-[#FAF5EC]/70 border border-[#EFECE6] rounded-2xl transition-all duration-200 group"
                  >
                    {/* Left content: Icon and Details */}
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Icon container */}
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#EFECE6] flex items-center justify-center text-[#8C6239] shrink-0 group-hover:scale-105 transition-transform">
                        <ArrowUpRight size={18} />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                          Secure Transaction ID
                        </span>
                        <span className="font-mono text-sm font-medium text-[#2D2219] break-all select-all bg-white sm:bg-transparent border sm:border-0 border-[#EFECE6] rounded-lg p-2 sm:p-0">
                          {tx.transaction_id || "tx_placeholder_id"}
                        </span>
                      </div>
                    </div>

                    {/* Right content: Status badge */}
                    <div className="mt-4 sm:mt-0 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold capitalize text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Success
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
