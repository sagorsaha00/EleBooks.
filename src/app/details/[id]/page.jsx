"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSingleBook, useToggleWishlist } from "@/lib/getData";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bookId = params.id || params.bookId || params.booksId;

  const { data: book, isLoading, isError, error } = useSingleBook(bookId);
  console.log("book", book);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [newComment, setNewComment] = useState("");

  const wishlistMutation = useToggleWishlist();

  const isLoggedIn = true;

  const user = JSON.parse(localStorage.getItem("library-auth-storage"))?.user;
  const currentUser = {
    name: user?.name || "Guest",
    email: user?.email || "guest@gmail",
  };

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", bookId],
    queryFn: async () => {
      if (!bookId) return [];
      const res = await fetch(`http://localhost:3001/books/comments/${bookId}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    enabled: !!bookId,
  });

  const commentMutation = useMutation({
    mutationFn: async (commentData) => {
      const res = await fetch("http://localhost:3001/books/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      return res.json();
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", bookId] });
    },
    onError: (err) => {
      alert(err.message || "Something went wrong while posting comment.");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-pulse font-medium text-gray-500">
          Loading library resources...
        </div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-red-500 font-semibold">
        {error?.message || "Book details could not be retrieved."}
      </div>
    );
  }

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      alert("Please login first to wishlist this book!");
      router.push("/login");
      return;
    }
    wishlistMutation.mutate(
      { bookId: book._id, userEmail: currentUser.email },
      {
        onSuccess: (res) => setIsWishlisted(res.isWishlisted),
        onError: (err) => alert(err.message || "Something went wrong!"),
      },
    );
  };

  const handleRequestDelivery = () => {
    if (!isLoggedIn) {
      alert("Please login first!");
      router.push("/login");
      return;
    }
    router.push(
      `/checkout?bookId=${book._id}&fee=${book.fee}&title=${encodeURIComponent(book.title)}`,
    );
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isLoggedIn) return;

    commentMutation.mutate({
      bookId: book._id,
      librarianEmail: book.librarianEmail,
      userEmail: currentUser.email,
      userName: currentUser.name,
      text: newComment,
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2219] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* ─── MAIN BOOK DETAILS CARD ─── */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-10 shadow-sm md:flex gap-10 items-start mb-8">
          <div className="w-full md:w-2/5 mb-8 md:mb-0 relative group">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF5EC] border border-[#EFECE6] shadow-sm">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>

            <button
              onClick={handleWishlistToggle}
              disabled={wishlistMutation.isPending}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-[#EFECE6] hover:bg-white shadow-sm active:scale-95 transition-all group/btn disabled:opacity-50"
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  isWishlisted
                    ? "fill-red-500 stroke-red-500"
                    : "stroke-gray-600 fill-none group-hover/btn:stroke-red-500"
                }`}
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
          </div>

          <div className="w-full md:w-3/5 flex flex-col justify-between h-full">
            <div>
              <span className="inline-block bg-[#FAF5EC] border border-[#EFECE6] text-[10px] font-bold text-[#8C6239] px-3 py-1 rounded-md uppercase tracking-wider mb-4">
                {book.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight mb-2">
                {book.title}
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                by{" "}
                <span className="font-semibold text-[#2D2219]">
                  {book.author}
                </span>
              </p>

              <div className="flex gap-0.5 mb-6 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-400 ml-2 font-medium self-center">
                  (5.0/5 Rating)
                </span>
              </div>

              <hr className="border-[#EFECE6] mb-6" />

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-8 bg-[#FAF5EC]/50 p-4 rounded-2xl border border-[#EFECE6]">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">
                    Assigned Librarian
                  </span>
                  <span className="font-medium text-[#2D2219]">
                    {book.librarian}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">
                    Availability Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-xs capitalize text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {book.status}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">
                    Processing Date
                  </span>
                  <span className="font-medium text-gray-600">
                    {new Date(book.processedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">
                    Book ID
                  </span>
                  <span className="font-mono text-xs text-gray-500 truncate block">
                    {book._id}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EFECE6] pt-6 sm:flex items-center justify-between gap-4">
              <div className="mb-4 sm:mb-0">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">
                  Borrowing Fee
                </p>
                <p className="text-3xl font-serif font-black text-[#8C6239]">
                  ${Number(book.fee).toFixed(2)}
                </p>
              </div>
              <div className="flex-1 max-w-xs w-full">
                <button
                  onClick={handleRequestDelivery}
                  className="w-full bg-[#8C6239] hover:bg-[#734f2d] text-[#FDFBF7] font-semibold text-sm py-3.5 px-6 rounded-xl shadow-sm hover:shadow active:scale-98 transition-all"
                >
                  Request Delivery
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 💬 PUBLIC COMMENTS & REVIEWS SECTION ─── */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-serif font-black text-[#1A110B] tracking-tight">
              Public Discussion
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Read community insights or ask the librarian a question.
            </p>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                isLoggedIn
                  ? "Share your feedback or queries about this book..."
                  : "Please log in to write a review."
              }
              disabled={!isLoggedIn}
              className="w-full p-4 rounded-xl border border-[#EFECE6] text-sm bg-[#FDFBF7]/50 focus:outline-none focus:ring-1 focus:ring-[#8C6239] transition-all placeholder:text-gray-400"
              required
            />
            {isLoggedIn && (
              <div className="flex justify-end mt-2.5">
                <button
                  type="submit"
                  disabled={commentMutation.isPending}
                  className="bg-[#8C6239] hover:bg-[#734f2d] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {commentMutation.isPending ? "Posting..." : "Post Review"}
                </button>
              </div>
            )}
          </form>

          <div className="space-y-4">
            {commentsLoading ? (
              <p className="text-xs text-gray-400 italic py-4">
                Syncing threads...
              </p>
            ) : comments.length > 0 ? (
              comments.map((comment) => {
                const isLibrarian =
                  comment.userEmail ===
                  (book.librarianEmail ||
                    book.userEmail ||
                    "librarian@example.com");
                return (
                  <div
                    key={comment._id}
                    className="p-5 rounded-2xl bg-[#FAF5EC]/20 border border-[#EFECE6] hover:bg-[#FAF5EC]/40 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#2D2219]">
                          {comment.userName}
                        </span>
                        {isLibrarian && (
                          <span className="bg-[#8C6239] text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wider">
                            Librarian / Owner
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal whitespace-pre-line">
                      {comment.text}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 border border-dashed border-[#EFECE6] rounded-2xl bg-[#FDFBF7]/30">
                <p className="text-xs text-gray-400 italic">
                  No public thoughts recorded yet. Start the discussion!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
