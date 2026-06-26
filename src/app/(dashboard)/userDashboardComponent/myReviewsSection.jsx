"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession, getSession } from "../../../lib/auth-client";

const url = "https://book-appoitment-backend-server.vercel.app";

export default function MyReviewsSection() {
  const queryClient = useQueryClient();
  const { data, isPending } = useSession();
  console.log("data", data?.user);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const currentUserEmail =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("library-auth-storage"))?.user?.email ||
        ""
      : "";

  // ১. কমেন্ট ফেচ করার কুয়েরি
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userComment", currentUserEmail],
    queryFn: async () => {
      if (!currentUserEmail) return { message: [] };
      const response = await fetch(`${url}/books/getComments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useremail: currentUserEmail }),
      });
      if (!response.ok) throw new Error("Failed to load reviews");
      return response.json();
    },
    enabled: !!currentUserEmail,
  });

  const myReviewsList = reviewsData?.message || [];

  // ২. কমেন্ট এডিট করার মিউটেশন
  const editMutation = useMutation({
    mutationFn: async ({ commentId, text }) => {
      const res = await fetch(`${url}/books/editComment/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: currentUserEmail, text }),
      });
      if (!res.ok) throw new Error("Failed to update comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userComment", currentUserEmail],
      });
      setEditingCommentId(null); // এডিট মোড বন্ধ করা
    },
    onError: (err) => alert(err.message),
  });

  // ৩. কমেন্ট ডিলিট করার মিউটেশন
  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      const res = await fetch(`${url}/books/deleteComment/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: currentUserEmail }),
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userComment", currentUserEmail],
      });
    },
    onError: (err) => alert(err.message),
  });

  const handleEditClick = (review) => {
    setEditingCommentId(review._id);
    setEditText(review.text);
  };

  const handleDeleteClick = (commentId) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate(commentId);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto font-sans bg-slate-50 text-slate-800 min-h-screen">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          My Shared Feedback
        </h1>
      </div>

      {isLoading && (
        <p className="text-center text-slate-500">Syncing your reviews...</p>
      )}

      {error && (
        <p className="text-rose-500 text-center">
          Failed to load data connection.
        </p>
      )}

      {!isLoading && myReviewsList.length === 0 && (
        <p className="text-center py-12 text-slate-400 italic">
          No reviews published yet.
        </p>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-4 w-full">
        {myReviewsList.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-4"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-600">
                  {review.userName
                    ? review.userName.charAt(0).toUpperCase()
                    : "A"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {review.userName || "Anonymous User"}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Book ID: #
                    {review.bookId
                      .substring(review.bookId.length - 6)
                      .toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(review)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded hover:bg-indigo-50 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(review._id)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Comment Body / Conditional Edit Input */}
            {editingCommentId === review._id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-500"
                  rows="3"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      editMutation.mutate({
                        commentId: review._id,
                        text: editText,
                      })
                    }
                    disabled={editMutation.isPending}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3.5">
                <p className="text-sm text-slate-600 whitespace-pre-line">
                  {review.text}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              <span>{review.updatedAt ? "✏️ Edited" : "✅ Published"}</span>
              <span>Librarian: {review.librarianEmail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
