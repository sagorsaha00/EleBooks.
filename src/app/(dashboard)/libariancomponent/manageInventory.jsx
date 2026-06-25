"use client";

import React, { useEffect, useState } from "react";
import {
  useLibrarianInventory,
  useTogglePublish,
  useDeleteBook,
} from "@/lib/getData";
import { useAuth } from "@/lib/AppContext";
import { useRouter } from "next/navigation";

export default function LibrarianInventory() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [librarianEmail, setLibrarianEmail] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    const userString = localStorage.getItem("library-auth-storage");
    if (userString) {
      try {
        const parsedUser = JSON.parse(userString);
        if (parsedUser?.user?.email) {
          setLibrarianEmail(parsedUser.user.email);
        }
      } catch (e) {
        console.error("Error parsing auth storage", e);
      }
    }
  }, [isLoggedIn, router]);

  const {
    data: books = [],
    isLoading,
    isError,
  } = useLibrarianInventory(librarianEmail);
  const togglePublishMutation = useTogglePublish();
  const deleteBookMutation = useDeleteBook();

  const handleStatusToggle = (bookId, currentStatus) => {
    togglePublishMutation.mutate({ bookId, currentStatus });
  };

  const handleDelete = (bookId) => {
    if (confirm("Are you sure you want to permanently remove this volume?")) {
      deleteBookMutation.mutate(bookId);
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-sm font-serif italic text-[#8C6239]">
        Loading Inventory...
      </div>
    );

  if (isError)
    return (
      <div className="p-8 text-center text-red-500 text-sm font-medium">
        Failed to load librarian ledger.
      </div>
    );

  return (
    <div className="w-full bg-[#FDFBF7] p-4 sm:p-8 rounded-3xl border border-[#EFECE6] text-[#2D2219] font-sans">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight">
          Librarian Inventory Ledger
        </h1>
        <p className="text-xs text-gray-400">
          Managed by Curator:{" "}
          <span className="text-[#8C6239] font-semibold">
            {librarianEmail || "Loading..."}
          </span>
        </p>
      </div>

      <div className="overflow-x-auto w-full bg-white rounded-2xl border border-[#EFECE6] shadow-sm">
        <table className="table w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#EFECE6] text-[#8C6239] text-xs font-bold uppercase tracking-wider bg-[#FAF5EC]/60">
              <th className="p-4 pl-6">Book Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Listing Fee</th>
              <th className="p-4">Inventory Status</th>
              <th className="p-4 text-center">Control Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFECE6]">
            {books.map((book) => {
              const currentStatus =
                book.status || book.displayStatus || "pending";
              const isPending =
                currentStatus === "pending" ||
                currentStatus === "Pending Approval";
              const isLive =
                currentStatus === "approved" || currentStatus === "Published";
              const isHidden =
                currentStatus === "unpublish" ||
                currentStatus === "Unpublished";

              return (
                <tr
                  key={book._id}
                  className="hover:bg-[#FAF5EC]/20 transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="font-bold text-[#2D2219]">{book.title}</div>
                    <div className="text-xs text-gray-400">
                      by {book.author}
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="bg-[#FAF5EC] text-[#8C6239] border border-[#EFECE6] text-[11px] px-2.5 py-0.5 rounded-md font-medium">
                      {book.category}
                    </span>
                  </td>

                  <td className="p-4 font-serif font-bold text-[#8C6239]">
                    ${Number(book.fee || 0).toFixed(2)}
                  </td>

                  <td className="p-4">
                    {isPending && (
                      <span className="bg-amber-50 text-amber-600 border border-amber-100 text-xs px-2.5 py-0.5 rounded-md font-semibold">
                        Pending Approval
                      </span>
                    )}
                    {isLive && (
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs px-2.5 py-0.5 rounded-md font-semibold">
                        Live / Published
                      </span>
                    )}
                    {isHidden && (
                      <span className="bg-red-50 text-red-600 border border-red-100 text-xs px-2.5 py-0.5 rounded-md font-semibold">
                        Hidden / Unpublished
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() =>
                          handleStatusToggle(book._id, currentStatus)
                        }
                        disabled={isPending || togglePublishMutation.isPending}
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                          isPending
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : isLive
                              ? "bg-white border-red-200 text-red-600 hover:bg-red-50"
                              : "bg-[#8C6239] border-[#8C6239] text-white hover:bg-[#734f2d]"
                        }`}
                        title={
                          isPending ? "Awaiting Admin Nod" : "Change Visibility"
                        }
                      >
                        {isLive ? "Unpublish" : isHidden ? "Publish" : "Locked"}
                      </button>

                      <button
                        onClick={() => handleDelete(book._id)}
                        disabled={deleteBookMutation.isPending}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete Completely"
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

      {books.length === 0 && (
        <div className="text-center py-12 text-sm text-gray-400">
          You haven't submitted any books to the library system yet.
        </div>
      )}
    </div>
  );
}
