"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useSingleBook,
  useToggleWishlist,
  useUpdateBookStatus,
} from "@/lib/getData";
import {
  Trash2,
  Edit3,
  Pause,
  Play,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import HeaderSection from "../../component/headerSection";
import AttractivePremiumFooter from "../../component/footerSection";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bookId = params.id || params.bookId || params.booksId;

  // ─── CORE QUERIES ───
  const { data: book, isLoading, isError, error } = useSingleBook(bookId);
  const wishlistMutation = useToggleWishlist();
  const updateStatusMutation = useUpdateBookStatus();

  // ─── LOCAL STATES FOR REALTIME UI REFLECTION ───
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [currentBookStatus, setCurrentBookStatus] = useState(""); // ✨ রিয়েল-টাইম বাটন ট্র্যাক করার জন্য লোকাল স্টেট
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    description: "",
  });

  // ─── AUTH & MOUNT MANAGEMENT ───
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("library-auth-storage");
      if (storage) {
        setUser(JSON.parse(storage)?.user);
      }
    }
  }, []);

  const isLoggedIn = !!user;
  const currentUser = {
    name: user?.name || "Guest",
    email: user?.email || "",
  };

  const isLibrarian =
    isLoggedIn && book && currentUser.email === book.librarianEmail;

  // ─── SYNC CORE DATA TO LOCAL STATES ───
  useEffect(() => {
    if (book) {
      setCurrentBookStatus(book.status || "approved"); // সার্ভার থেকে আসা স্ট্যাটাস সিঙ্ক
      setEditForm({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
      });
    }
  }, [book]);

  // ─── SALES GATE / PURCHASE VERIFICATION ───
  const { data: purchaseData } = useQuery({
    queryKey: ["purchase-verify", bookId, currentUser.email],
    queryFn: async () => {
      if (!bookId || !currentUser.email) return { hasPurchased: false };
      const res = await fetch(
        `http://localhost:3001/books/sales/verify?bookId=${bookId}&userEmail=${currentUser.email}`,
      );
      if (!res.ok) return { hasPurchased: false };
      return res.json();
    },
    enabled: !!bookId && isLoggedIn && !isLibrarian,
  });
  const hasPurchasedBook = purchaseData?.hasPurchased || false;

  // ─── COMMENTS THREAD QUERY ───
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

  // ─── MUTATIONS ───
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
  });

  const updateBookMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await fetch(`http://localhost:3001/books/update/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update book details");
      return res.json();
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
      alert("Book metadata updated successfully.");
    },
    onError: (err) => alert(err.message),
  });

  const deleteBookMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`http://localhost:3001/books/delete/${bookId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStatus: currentBookStatus }),
      });
      if (!res.ok) throw new Error("Failed to delete book asset.");
      return res.json();
    },
    onSuccess: () => {
      alert("Asset deleted successfully.");
      router.push("/dashboard");
    },
    onError: (err) => alert(err.message),
  });

  // ─── ACTION HANDLERS ───
  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    wishlistMutation.mutate(
      { bookId: book?._id, userEmail: currentUser.email },
      { onSuccess: (res) => setIsWishlisted(res.isWishlisted) },
    );
  };

  const handleRequestDelivery = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    router.push(
      `/checkout?bookId=${book?._id}&fee=${book.fee}&title=${encodeURIComponent(book.title)}`,
    );
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateBookMutation.mutate(editForm);
  };

  const handleDeleteAsset = () => {
    if (confirm("Are you sure you want to delete this book?")) {
      deleteBookMutation.mutate();
    }
  };

  // ⚡ INSTANT REALTIME BUTTON TOGGLE HANDLER (OPTIMISTIC UPDATE)
  const handleToggleUnpublish = () => {
    const previousStatus = currentBookStatus;
    const currentStatusClean = (previousStatus || "approved").toLowerCase();

    // ১. কি অ্যাকশন হবে এবং পরের স্ট্যাটাস কি হবে তা নির্ধারণ
    const nextAction =
      currentStatusClean === "unpublish" || currentStatusClean === "unpublished"
        ? "approved"
        : "unpublish";
    const optimisticStatus =
      nextAction === "unpublish" ? "Unpublished" : "Approved";

    // ২. এপিআই কলের আগেই UI ইনস্ট্যান্ট চেইঞ্জ করার জন্য স্টেট আপডেট
    setCurrentBookStatus(optimisticStatus);

    updateStatusMutation.mutate(
      { bookId: book?._id, currentStatus: previousStatus, action: nextAction },
      {
        onSuccess: (res) => {
          // সার্ভার সাকসেস হলে ক্যাশ ডাটা রিভ্যালিডেট করা হবে
          queryClient.invalidateQueries({ queryKey: ["book", bookId] });
          if (res?.updatedStatus) {
            setCurrentBookStatus(res.updatedStatus);
          }
        },
        onError: (err) => {
          // এপিআই কল ফেইল করলে স্বয়ংক্রিয়ভাবে আগের স্ট্যাটাসে ব্যাক (Rollback) করবে
          setCurrentBookStatus(previousStatus);
          alert(
            "Server syncing failed. Reverting status. Error: " + err.message,
          );
        },
      },
    );
  };

  const isCurrentlyUnpublished =
    currentBookStatus?.toLowerCase() === "unpublish" ||
    currentBookStatus?.toLowerCase() === "unpublished";

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-pulse text-[#8C6239] text-sm italic">
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isLoggedIn || isLibrarian || !hasPurchasedBook)
      return;

    commentMutation.mutate({
      bookId: book?._id,
      librarianEmail: book.librarianEmail,
      userEmail: currentUser.email,
      userName: currentUser.name,
      text: newComment,
    });
  };

  return (
    <>
      <HeaderSection></HeaderSection>
      <div className="min-h-screen bg-[#FDFBF7] text-[#2D2219] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto">
          {/* ADMINISTRATIVE ACTION BANNER */}
          {isLibrarian && (
            <div className="mb-6 bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <ShieldAlert size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Librarian Access Active
                  </p>
                  <p className="text-xs text-amber-600 font-medium">
                    You possess management permissions for this book cluster.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-1.5 text-xs font-bold border px-3 py-2 rounded-xl transition-all shadow-sm ${
                    isEditing
                      ? "bg-amber-600 border-amber-600 text-white hover:bg-amber-700"
                      : "bg-white border-amber-200 hover:bg-amber-100 text-amber-800"
                  }`}
                >
                  <Edit3 size={12} />{" "}
                  {isEditing ? "Viewing Mode" : "Edit Metadata"}
                </button>
                <button
                  onClick={handleToggleUnpublish}
                  className="flex items-center gap-1.5 text-xs font-bold bg-[#FAF5EC] border border-[#EFECE6] text-[#8C6239] hover:bg-[#8C6239] hover:text-white px-3 py-2 rounded-xl transition-all shadow-sm"
                >
                  {isCurrentlyUnpublished ? (
                    <Play size={12} />
                  ) : (
                    <Pause size={12} />
                  )}
                  {isCurrentlyUnpublished ? "Publish" : "Unpublish"}
                </button>
                <button
                  onClick={handleDeleteAsset}
                  className="flex items-center gap-1.5 text-xs font-bold bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 rounded-xl transition-all shadow-sm"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          )}

          {/* MAIN LAYOUT BLOCK */}
          <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-10 shadow-sm md:flex gap-10 items-stretch mb-8">
            {/* Left Block: Cover Showcase */}
            <div className="w-full md:w-2/5 mb-8 md:mb-0 relative group">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF5EC] border border-[#EFECE6] shadow-sm h-full max-h-[480px]">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {!isLibrarian && (
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistMutation.isPending}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-[#EFECE6] hover:bg-white shadow-sm transition-all"
                >
                  <svg
                    className={`w-5 h-5 ${isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-gray-600 fill-none"}`}
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Right Block: Content Data OR Boxed Responsive Edit Component */}
            <div className="w-full md:w-3/5 flex flex-col justify-between">
              {isEditing ? (
                /* 📦 FULLY RESPONSIVE BOXED EDIT INTERFACE (MATCHES MAIN LAYOUT) 📦 */
                <div className="bg-[#FAF5EC]/50 border border-[#EFECE6] rounded-2xl p-5 sm:p-8 shadow-inner h-full flex flex-col justify-between w-full">
                  <form
                    onSubmit={handleUpdateSubmit}
                    className="space-y-5 w-full"
                  >
                    <div className="flex items-center gap-2 pb-3 border-b border-[#EFECE6]">
                      <Edit3 size={18} className="text-[#8C6239]" />
                      <h2 className="font-serif font-black text-xl text-[#2D2219]">
                        Edit Book Specifications
                      </h2>
                    </div>

                    <div className="w-full">
                      <label className="text-[11px] font-bold text-[#8C6239] uppercase tracking-wider block mb-1.5">
                        Book Title
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="w-full p-3.5 text-sm bg-white border border-[#EFECE6] rounded-xl focus:ring-1 focus:ring-[#8C6239] focus:border-[#8C6239] focus:outline-none text-[#2D2219] transition-all shadow-sm"
                        required
                      />
                    </div>

                    <div className="w-full">
                      <label className="text-[11px] font-bold text-[#8C6239] uppercase tracking-wider block mb-1.5">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={editForm.author}
                        onChange={(e) =>
                          setEditForm({ ...editForm, author: e.target.value })
                        }
                        className="w-full p-3.5 text-sm bg-white border border-[#EFECE6] rounded-xl focus:ring-1 focus:ring-[#8C6239] focus:border-[#8C6239] focus:outline-none text-[#2D2219] transition-all shadow-sm"
                        required
                      />
                    </div>

                    <div className="w-full">
                      <label className="text-[11px] font-bold text-[#8C6239] uppercase tracking-wider block mb-1.5">
                        Description Summary
                      </label>
                      <textarea
                        rows="4"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-3.5 text-sm bg-white border border-[#EFECE6] rounded-xl focus:ring-1 focus:ring-[#8C6239] focus:border-[#8C6239] focus:outline-none text-[#2D2219] transition-all resize-none shadow-sm leading-relaxed"
                        placeholder="Provide an overview of the book contents..."
                      />
                    </div>

                    <div className="pt-3 w-full">
                      <button
                        type="submit"
                        disabled={updateBookMutation.isPending}
                        className="w-full bg-[#8C6239] hover:bg-[#734f2d] text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all active:scale-[0.99] shadow-md"
                      >
                        {updateBookMutation.isPending
                          ? "Updating Catalog..."
                          : "Save Innovations"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* NORMAL VIEW INTERFACE */
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="inline-block bg-[#FAF5EC] border border-[#EFECE6] text-[10px] font-bold text-[#8C6239] px-3 py-1 rounded-md uppercase tracking-wider mb-4">
                      {book.category}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight mb-2">
                      {book.title}
                    </h1>
                    <p className="text-gray-500 text-sm mb-4">
                      by{" "}
                      <span className="font-semibold text-[#2D2219]">
                        {book.author}
                      </span>
                    </p>
                    {book.description && (
                      <p className="text-xs text-gray-400 leading-relaxed font-normal mb-6 max-w-xl">
                        {book.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm mb-6 bg-[#FAF5EC]/50 p-4 rounded-2xl border border-[#EFECE6]">
                      <div>
                        <span className="text-xs text-gray-400 block">
                          Librarian Custodian
                        </span>
                        <span className="font-medium text-[#2D2219] text-xs truncate block">
                          {book.librarian}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block">
                          Status Token
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded border uppercase mt-0.5 ${
                            isCurrentlyUnpublished
                              ? "text-rose-600 bg-rose-50 border-rose-100"
                              : "text-emerald-600 bg-emerald-50 border-emerald-100"
                          }`}
                        >
                          {currentBookStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#EFECE6] pt-6 flex items-center justify-between gap-4 mt-auto">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        Access Fee
                      </p>
                      <p className="text-2xl font-serif font-black text-[#8C6239]">
                        ${Number(book.fee).toFixed(2)}
                      </p>
                    </div>
                    {!isLibrarian && (
                      <div className="flex-1 max-w-xs w-full">
                        <button
                          onClick={handleRequestDelivery}
                          className="w-full bg-[#8C6239] hover:bg-[#734f2d] text-[#FDFBF7] font-semibold text-sm py-3 px-5 rounded-xl transition-all"
                        >
                          {isLoggedIn
                            ? "Request Delivery"
                            : "Sign In to Request"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DISCUSSION & GATED REVIEWS */}
          <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-serif font-black text-[#1A110B] tracking-tight">
                Public Discussion
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Read community insights or verified review parameters.
              </p>
            </div>

            {isLibrarian ? (
              <div className="mb-8 p-4 bg-[#FAF5EC]/40 border border-[#EFECE6] rounded-xl text-center text-xs text-gray-400 font-medium italic">
                🔒 Form deactivated. Staff members are excluded from submitting
                generic customer tier reviews.
              </div>
            ) : !isLoggedIn ? (
              <div
                className="mb-8 p-4 bg-[#FAF5EC]/40 border border-[#EFECE6] rounded-xl text-center text-xs text-[#8C6239] font-semibold cursor-pointer"
                onClick={() => router.push("/login")}
              >
                🔑 Authentication Required. Click here to login and interact
                with the platform thread.
              </div>
            ) : !hasPurchasedBook ? (
              <div className="mb-8 p-4 bg-amber-50/40 border border-amber-100 rounded-xl text-center text-xs text-amber-700 font-medium">
                🔒 Review Locked. You must successfully process a delivery
                request for this specific literary token to unlock public
                reviews.
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your verified experience regarding this book asset..."
                  className="w-full p-4 rounded-xl border border-[#EFECE6] text-sm bg-[#FDFBF7]/50 focus:outline-none focus:ring-1 focus:ring-[#8C6239] transition-all"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    <CheckCircle2 size={12} /> Verified Purchase Account
                  </span>
                  <button
                    type="submit"
                    disabled={commentMutation.isPending}
                    className="bg-[#8C6239] hover:bg-[#734f2d] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all"
                  >
                    {commentMutation.isPending
                      ? "Posting..."
                      : "Post Verified Review"}
                  </button>
                </div>
              </form>
            )}

            {/* Render Thread */}
            <div className="space-y-4">
              {commentsLoading ? (
                <p className="text-xs text-gray-400 italic py-4">
                  Syncing threads...
                </p>
              ) : comments.length > 0 ? (
                comments.map((comment) => {
                  const commentIsLibrarian =
                    comment.userEmail === book.librarianEmail;
                  return (
                    <div
                      key={comment?._id}
                      className="p-5 rounded-2xl bg-[#FAF5EC]/20 border border-[#EFECE6] hover:bg-[#FAF5EC]/40 transition-all"
                    >
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#2D2219]">
                            {comment.userName}
                          </span>
                          {commentIsLibrarian && (
                            <span className="bg-[#8C6239] text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">
                              Librarian / Owner
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">
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
                    No community responses recorded for this entry yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AttractivePremiumFooter></AttractivePremiumFooter>
    </>
  );
}
