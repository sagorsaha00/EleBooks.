"use client";

import React from "react";
import {
  useAdminBooks,
  useUpdateBookStatus,
  useDeleteAdminBook,
} from "../../../lib/getData";

export default function AdminBookDashboard() {
  const { data: books, isLoading, isError } = useAdminBooks();
  const updateStatusMutation = useUpdateBookStatus();
  const deleteMutation = useDeleteAdminBook();

  // 🔄 স্ট্যাটাস চেঞ্জ হ্যান্ডেলার
  const handleAction = (bookId, currentStatus, actionType) => {
    updateStatusMutation.mutate({ bookId, currentStatus, action: actionType });
  };

  // 🗑️ ডিলিট হ্যান্ডেলার
  const handleDelete = (bookId, currentStatus) => {
    if (confirm("Are you sure you want to delete this completely?")) {
      deleteMutation.mutate({ bookId, currentStatus });
    }
  };

  if (isLoading)
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        Loading Admin Dashboard...
      </div>
    );
  if (isError)
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Error loading book data.
      </div>
    );

  return (
    <div className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-[#2D2219]">
      <div className="mb-4">
        <h2 className="text-xl font-serif font-black">
          Global Catalog Management
        </h2>
        <p className="text-xs text-gray-500">
          Approve new listings or override active status toggles instantly.
        </p>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="table w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-none">
              <th className="bg-transparent pl-4">Title</th>
              <th className="bg-transparent">Author</th>
              <th className="bg-transparent">Category</th>
              <th className="bg-transparent">Fee</th>
              <th className="bg-transparent">Librarian</th>
              <th className="bg-transparent">Status</th>
              <th className="bg-transparent text-center">Status Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {books?.map((book) => {
              // 💡 আপনার ডাটাবেজের ভ্যালু (যেমন: "approved", "pending", "rejected", "unpublish") রিড করা হচ্ছে
              const currentStatus =
                book.status || book.displayStatus || "pending";

              return (
                <tr
                  key={book._id}
                  className="hover:bg-gray-50/80 transition-colors text-sm rounded-xl"
                >
                  <td className="font-medium p-4 pl-4">{book.title}</td>
                  <td className="text-gray-500">{book.author}</td>
                  <td>
                    <span className="bg-purple-50 text-purple-600 text-xs px-2.5 py-1 rounded-full font-semibold">
                      {book.category}
                    </span>
                  </td>
                  <td className="font-semibold text-[#8C6239]">
                    ${Number(book.fee).toFixed(2)}
                  </td>
                  <td className="text-gray-500 text-xs">{book.librarian}</td>

                  {/* 🏷️ স্ট্যাটাস ব্যাজ (আপনার ডেটাবেজের ভ্যালু অনুযায়ী ম্যাচ করা) */}
                  <td>
                    {(currentStatus === "pending" ||
                      currentStatus === "Pending Approval") && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-md font-medium">
                        Pending Approval
                      </span>
                    )}
                    {(currentStatus === "unpublish" ||
                      currentStatus === "Unpublished") && (
                      <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-md font-medium">
                        Unpublished
                      </span>
                    )}
                    {(currentStatus === "approved" ||
                      currentStatus === "Published") && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-md font-medium">
                        Approved & Published
                      </span>
                    )}
                    {currentStatus === "checked_out" && (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-1 rounded-md font-medium">
                        Checked Out
                      </span>
                    )}
                    {(currentStatus === "rejected" ||
                      currentStatus === "Rejected") && (
                      <span className="bg-gray-100 text-gray-700 border border-gray-300 text-xs px-2.5 py-1 rounded-md font-medium">
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* ⚙️ অ্যাকশন কন্ট্রোল বাটন গ্রুপ */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* ১. পেন্ডিং থাকলে Approve এবং Reject বাটন আসবে */}
                      {(currentStatus === "pending" ||
                        currentStatus === "Pending Approval") && (
                        <>
                          <button
                            onClick={() =>
                              handleAction(book._id, currentStatus, "approved")
                            }
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1.5 rounded-md transition-colors shadow-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleAction(book._id, currentStatus, "rejected")
                            }
                            className="text-xs bg-white border border-red-200 hover:bg-red-50 text-red-600 font-medium px-2.5 py-1.5 rounded-md transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* ২. যদি অলরেডি "approved" থাকে -> তাহলে Unpublish করার বাটন আসবে */}
                      {(currentStatus === "approved" ||
                        currentStatus === "Published") && (
                        <button
                          title="Hide/Unpublish book from main catalog"
                          onClick={() =>
                            handleAction(book._id, currentStatus, "unpublish")
                          }
                          className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm flex items-center gap-1"
                        >
                          ⏸️ Unpublish
                        </button>
                      )}

                      {/* ৩. যদি "unpublish" করা থাকে -> পুনরায় Publish/Approve করার বাটন আসবে */}
                      {(currentStatus === "unpublish" ||
                        currentStatus === "Unpublished") && (
                        <button
                          title="Relaunch book to main store"
                          onClick={() =>
                            handleAction(book._id, currentStatus, "approved")
                          }
                          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm flex items-center gap-1"
                        >
                          ▶️ Publish
                        </button>
                      )}

                      {/* ৪. গ্লোবাল ডিলিট বাটন */}
                      <button
                        title="Delete Permanently From Database"
                        onClick={() => handleDelete(book._id, currentStatus)}
                        className="p-1.5 bg-gray-50 border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all ml-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
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
