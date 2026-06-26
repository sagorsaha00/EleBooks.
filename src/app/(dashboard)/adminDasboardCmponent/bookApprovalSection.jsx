"use client";

import React from "react";
import {
  useBooks,
  useApproveBookRequest,
  useDeleteBookRequest,
} from "../../../lib/getData";

export default function BookManageSection() {
  const { data: books, isLoading, isError, error } = useBooks();

  const approveMutation = useApproveBookRequest();
  const deleteMutation = useDeleteBookRequest();

  const handleApprove = (requestId, value) => {
    console.log("Request ID:", requestId);
    console.log("Value:", value);
    approveMutation.mutate({ requestId, value });
  };
  if (isLoading)
    return (
      <div className="p-6 text-center text-sm font-medium">
        Loading submissions...
      </div>
    );
  if (isError)
    return (
      <div className="p-6 text-center text-error text-sm font-medium">
        Error: {error.message}
      </div>
    );

  return (
    <div className="w-full bg-base-100 p-2 sm:p-6 rounded-xl">
      <div className="block sm:hidden space-y-3">
        {books?.map((book) => (
          <div
            key={book._id}
            className="bg-base-200/50 p-4 rounded-xl space-y-3 border border-base-300"
          >
            <div>
              <h4 className="font-bold text-base-content text-base">
                {book.title}
              </h4>
              <p className="text-xs text-gray-500">
                {book.author} •{" "}
                <span className="text-purple-600 font-semibold">
                  {book.category}
                </span>
              </p>
            </div>

            <div className="flex justify-between items-center text-xs pt-1 border-t border-base-300/60">
              <div>
                <span className="block text-gray-400">Fee</span>
                <span className="font-bold text-base-content">
                  ${Number(book.fee).toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-gray-400">Librarian</span>
                <span className="font-medium text-gray-600">
                  {book.librarian}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-gray-400">{book.date}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(book._id, "approved")}
                  disabled={approveMutation.isPending}
                  className="btn  btn-primary btn-xs rounded-md text-white h-8 bg-indigo-600 border-none px-3"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApprove(book._id, "rejected")}
                  disabled={deleteMutation.isPending}
                  className="btn btn-outline btn-error btn-xs rounded-md h-8 px-3"
                >
                  Rejecte
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto w-full">
        <table className="table w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-none">
              <th className="bg-transparent pl-4">Title</th>
              <th className="bg-transparent">Author</th>
              <th className="bg-transparent">Category</th>
              <th className="bg-transparent">Fee</th>
              <th className="bg-transparent">Librarian</th>
              <th className="bg-transparent">Date</th>
              <th className="bg-transparent text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books?.map((book) => (
              <tr
                key={book._id}
                className="bg-base-200/40 hover:bg-base-200/80 transition-colors text-sm font-medium text-base-content rounded-xl"
              >
                <td className="rounded-l-xl pl-4 py-4 font-semibold">
                  {book.title}
                </td>
                <td className="text-gray-500 font-normal">{book.author}</td>
                <td>
                  <span className="bg-purple-100/70 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300 text-xs px-3 py-1 rounded-full font-semibold">
                    {book.category}
                  </span>
                </td>
                <td className="font-semibold">
                  ${Number(book.fee).toFixed(2)}
                </td>
                <td className="text-gray-500 font-normal">{book.librarian}</td>
                <td className="text-gray-400 font-normal">{book.date}</td>
                <td className="rounded-r-xl text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleApprove(book._id, "approved")}
                      disabled={approveMutation.isPending}
                      className="btn btn-primary btn-sm rounded-lg text-white font-semibold px-4 flex items-center gap-1 normal-case h-9 min-h-0 bg-indigo-600 hover:bg-indigo-700 border-none shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => handleApprove(book._id, "rejected")}
                      disabled={deleteMutation.isPending}
                      className="btn btn-outline btn-error btn-sm rounded-lg font-semibold px-3 flex items-center gap-1 normal-case h-9 min-h-0 bg-red-50/50 hover:bg-red-500 hover:text-white border border-red-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .         562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
