import React from "react";
import { useSalesReportLibarian } from "../../../lib/getData";

export default function ManageDelivery() {
  // 1. Safely retrieve and parse the user email from localStorage
  const userEmail =
    JSON.parse(localStorage.getItem("library-auth-storage"))?.user?.email || "";

  // 2. Fetch the delivery/sales reports based on the email
  const {
    data: salesData,
    isLoading,
    error,
  } = useSalesReportLibarian(userEmail);

  const userSalesReport = salesData?.salesReport || [];

  // Derived Summary Analytics
  const totalDeliveries = userSalesReport.length;
  const totalEarnings = userSalesReport.reduce(
    (sum, item) => sum + (item.fee || 0),
    0,
  );
  const publishedCount = userSalesReport.filter(
    (item) => item.displayStatus === "Published",
  ).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-sans bg-slate-50 text-slate-800">
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
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 w-full">
          <div className="flex-1 min-w-[200px] bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Shipments
            </span>
            <span className="text-xl font-bold text-slate-900 mt-1">
              {totalDeliveries}
            </span>
          </div>
          <div className="flex-1 min-w-[200px] bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <span className="text-xl font-bold text-emerald-600 mt-1">
              ${totalEarnings.toFixed(2)}
            </span>
          </div>
          <div className="flex-1 min-w-[200px] bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Published
            </span>
            <span className="text-xl font-bold text-indigo-600 mt-1">
              {publishedCount}
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

      {/* Main Delivery List - PURE FLEX VERTICAL LIST ROW TYPE */}
      <div className="flex flex-col gap-4 w-full">
        {userSalesReport.map((book) => {
          const isPublished = book.displayStatus === "Published";

          return (
            <div
              key={book._id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 gap-4 group"
            >
              {/* Left Segment: Book Identity Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Optional Small Thumbnail Placeholder */}
                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-lg border border-slate-200/40 shrink-0 select-none">
                  📖
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-800 tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h3>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0">
                      {book.category}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-400">
                    by {book.author}
                  </p>
                </div>
              </div>

              {/* Middle Segment: Metadata Logs */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-slate-600 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Assigned Handler
                  </span>
                  <span className="font-semibold text-slate-700">
                    {book.librarian}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Processed On
                  </span>
                  <span className="font-medium text-slate-700">
                    {new Date(book.processedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex flex-col min-w-[100px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Tracking Code
                  </span>
                  <span className="font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 w-max text-[11px]">
                    #{book._id.substring(book._id.length - 6).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Right Segment: Status Badge and Pricing Column */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                {/* Status Condition Badge */}
                <span
                  className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider shadow-sm border ${
                    isPublished
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  {book.displayStatus || "Pending"}
                </span>

                {/* Processing Inbound Fee */}
                <div className="text-right flex items-center md:block gap-2">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none md:mb-1">
                    Fee
                  </span>
                  <span className="text-base font-black text-slate-900 tracking-tight">
                    ${book.fee ? book.fee.toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
