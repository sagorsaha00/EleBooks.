"use client";

import React from "react";
import {
  useAdminBooks,
  useUpdateBookStatus,
  useDeleteAdminBook,
} from "../../../lib/getData";
import { Trash2, Check, X, Pause, Play } from "lucide-react";

export default function AdminBookDashboard() {
  const { data: books, isLoading, isError } = useAdminBooks();
  const updateStatusMutation = useUpdateBookStatus();
  const deleteMutation = useDeleteAdminBook();

  const handleAction = (bookId, currentStatus, actionType) => {
    updateStatusMutation.mutate({ bookId, currentStatus, action: actionType });
  };

  // 🗑️ ডিলিট হ্যান্ডেলার
  const handleDelete = (bookId, currentStatus) => {
    if (confirm("Are you sure you want to delete this completely?")) {
      deleteMutation.mutate({ bookId, currentStatus });
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-pulse text-[#8C6239] text-sm italic">
          Loading Global Catalog Engine...
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#FDFBF7]">
        <div className="bg-red-50/60 border border-red-100 text-red-600 p-5 rounded-2xl text-sm font-medium">
          ⚠️ Error synchronizing global catalog database.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-10 shadow-sm text-[#2D2219]">
      {/* ─── COMPONENT HEADER ─── */}
      <div className="mb-8 pb-4 border-b border-[#EFECE6]">
        <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#2D2219]">
          Global Catalog Management
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Approve new listings or override active status toggles instantly
          across the infrastructure.
        </p>
      </div>

      {/* ─── DATA TABLE CONTROLLER ─── */}
      <div className="overflow-x-auto w-full rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EFECE6] text-gray-400 text-xs font-bold uppercase tracking-wider bg-[#FAF5EC]/40">
              <th className="p-4 pl-6">Title & Author</th>
              <th className="p-4">Category</th>
              <th className="p-4">Access Fee</th>
              <th className="p-4">Librarian</th>
              <th className="p-4">Status Token</th>
              <th className="p-4 text-center pr-6">Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFECE6]/60">
            {books?.map((book) => {
              const currentStatus =
                book.status || book.displayStatus || "pending";

              return (
                <tr
                  key={book._id}
                  className="hover:bg-[#FAF5EC]/20 transition-colors duration-150 text-sm"
                >
                  {/* Title & Author */}
                  <td className="p-4 pl-6 max-w-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#2D2219] truncate">
                        {book.title}
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5 font-medium">
                        by {book.author}
                      </span>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="p-4">
                    <span className="inline-block bg-[#FAF5EC] text-[#8C6239] border border-[#EFECE6] text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                      {book.category}
                    </span>
                  </td>

                  {/* Fee */}
                  <td className="p-4 font-serif font-bold text-[#2D2219]">
                    ${Number(book.fee).toFixed(2)}
                  </td>

                  {/* Librarian */}
                  <td className="p-4 text-gray-400 text-xs font-medium max-w-[120px] truncate">
                    {book.librarian || "System Auto"}
                  </td>

                  {/* Status Badges Matching Custom Architecture */}
                  <td className="p-4">
                    {(currentStatus === "pending" ||
                      currentStatus === "Pending Approval") && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Pending
                      </span>
                    )}
                    {(currentStatus === "unpublish" ||
                      currentStatus === "Unpublished") && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Unpublished
                      </span>
                    )}
                    {(currentStatus === "approved" ||
                      currentStatus === "Published") && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Live & Published
                      </span>
                    )}
                    {currentStatus === "checked_out" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Checked Out
                      </span>
                    )}
                    {(currentStatus === "rejected" ||
                      currentStatus === "Rejected") && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* Elegant Controls Button Matrix */}
                  <td className="p-4 text-center pr-6">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Conditional Action Render Strategy */}
                      {(currentStatus === "pending" ||
                        currentStatus === "Pending Approval") && (
                        <>
                          <button
                            onClick={() =>
                              handleAction(book._id, currentStatus, "approved")
                            }
                            className="p-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                            title="Approve & Publish Catalog Entry"
                          >
                            <Check size={14} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() =>
                              handleAction(book._id, currentStatus, "rejected")
                            }
                            className="p-1.5 bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all active:scale-90"
                            title="Reject Entry Request"
                          >
                            <X size={14} strokeWidth={2.5} />
                          </button>
                        </>
                      )}

                      {(currentStatus === "approved" ||
                        currentStatus === "Published") && (
                        <button
                          onClick={() =>
                            handleAction(book._id, currentStatus, "unpublish")
                          }
                          className="flex items-center gap-1 text-[11px] font-bold bg-amber-50 border border-amber-100 text-amber-700 hover:bg-amber-600 hover:text-white px-2.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-90"
                          title="Unpublish from Storefront"
                        >
                          <Pause size={12} fill="currentColor" />
                          Unpublish
                        </button>
                      )}

                      {(currentStatus === "unpublish" ||
                        currentStatus === "Unpublished") && (
                        <button
                          onClick={() =>
                            handleAction(book._id, currentStatus, "approved")
                          }
                          className="flex items-center gap-1 text-[11px] font-bold bg-[#FAF5EC] border border-[#EFECE6] text-[#8C6239] hover:bg-[#8C6239] hover:text-[#FDFBF7] px-2.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-90"
                          title="Republish to Active Catalog"
                        >
                          <Play size={12} fill="currentColor" />
                          Publish
                        </button>
                      )}

                      {/* Hard Purge Tool */}
                      <button
                        onClick={() => handleDelete(book._id, currentStatus)}
                        className="p-1.5 bg-gray-50 border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all ml-1 active:scale-90"
                        title="Delete Permanently From Infrastructure"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
