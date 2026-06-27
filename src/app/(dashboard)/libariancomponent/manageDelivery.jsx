"use client";

import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSalesReportLibarian, salesReportKey } from "../../../lib/getData";

export default function ManageDelivery() {
  const queryClient = useQueryClient();

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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, nextStatus }) => {
      const res = await fetch(
        `https://book-appoitment-backend-server.vercel.app/libarian/orders/${orderId}/${nextStatus}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!res.ok) throw new Error(`Failed to change status to ${nextStatus}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesReportKey(userEmail) });
    },
    onError: (err) => {
      alert(
        err.message || "Something went wrong while updating delivery status.",
      );
    },
  });

  const totalDeliveries = userSalesReport.length;

  const totalEarnings = userSalesReport.reduce(
    (sum, item) => sum + (item.amount || item.fee || 0),
    0,
  );

  const pendingCount = userSalesReport.filter(
    (item) => item.status === "pending",
  ).length;
  const completedCount = userSalesReport.filter(
    (item) => item.status === "completed",
  ).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-sans bg-slate-50 text-slate-800 min-h-screen">
      {/* Upper Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Delivery Management Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            Librarian:{" "}
            <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              {userEmail || "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* Analytics Overview Cards Row */}
      {!isLoading && !error && totalDeliveries > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Shipments
            </span>
            <span className="text-xl font-bold text-slate-900 mt-1">
              {totalDeliveries}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <span className="text-xl font-bold text-emerald-600 mt-1">
              ${totalEarnings.toFixed(2)}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Awaiting Approval
            </span>
            <span className="text-xl font-bold text-amber-600 mt-1">
              {pendingCount}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Fully Completed
            </span>
            <span className="text-xl font-bold text-indigo-600 mt-1">
              {completedCount}
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center h-64 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600/20 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-500">
            Retrieving secure dispatch data...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-100 flex items-center gap-3 shadow-sm max-w-2xl mx-auto my-12">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shrink-0"></div>
          <p className="text-sm font-medium">
            Failed to synchronize data connection.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && totalDeliveries === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200/60 max-w-md mx-auto my-12 p-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400 font-bold text-xl">
            !
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No active reports found
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            There are currently no active delivery pipelines associated with
            this account.
          </p>
        </div>
      )}

      {/* Main Delivery List */}
      <div className="flex flex-col gap-4 w-full">
        {userSalesReport.map((book) => {
          const currentStatus = book.status || "pending";

          return (
            <div
              key={book._id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between p-5 gap-4 group"
            >
              {/* Left Segment: Identity Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="h-12 w-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shrink-0 select-none">
                  📦
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-800 tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                      {book.bookTitle || "Premium Volume Access"}
                    </h3>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0">
                      Paid Customer
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-400 truncate">
                    Buyer:{" "}
                    <span className="text-slate-600">{book.userEmail}</span>
                  </p>
                </div>
              </div>

              {/* Middle Segment: Metadata Logs */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-slate-600 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Transaction ID
                  </span>
                  <span className="font-mono text-slate-600 truncate max-w-[120px]">
                    {book.transaction_id || "Stripe_Intent"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Ordered On
                  </span>
                  <span className="font-medium text-slate-700">
                    {new Date(book.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Fulfillment Code
                  </span>
                  <span className="font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 text-[11px]">
                    #{book._id.substring(book._id.length - 6).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Right Segment: Status Badge and Actions */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 shrink-0 min-w-[200px]">
                {/* Dynamic Status Badge */}
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider border ${
                    currentStatus === "pending"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : currentStatus === "approved"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : currentStatus === "dispatched"
                          ? "bg-purple-50 border-purple-200 text-purple-700"
                          : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}
                >
                  {currentStatus}
                </span>

                {/* Dynamic Action Buttons */}
                <div className="text-right">
                  {currentStatus === "pending" && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          orderId: book._id,
                          nextStatus: "approve",
                        })
                      }
                      disabled={updateStatusMutation.isPending}
                      className="bg-[#8C6239] hover:bg-[#734f2d] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      Approve Request
                    </button>
                  )}

                  {currentStatus === "approved" && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          orderId: book._id,
                          nextStatus: "dispatch",
                        })
                      }
                      disabled={updateStatusMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      Dispatch Book
                    </button>
                  )}

                  {currentStatus === "dispatched" && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          orderId: book._id,
                          nextStatus: "complete",
                        })
                      }
                      disabled={updateStatusMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      Complete Order
                    </button>
                  )}

                  {currentStatus === "completed" && (
                    <span className="text-xs text-slate-400 font-medium italic flex items-center gap-1">
                      ✅ Fully Handled
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
