"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUserWishlist, useToggleWishlist } from "@/lib/getData";

export default function WishlistPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("library-auth-storage"));

    setUserEmail(storedUser?.user?.email || "");
  }, []);

  // ✅ wishlist data
  const { data: wishlistResponse = {}, isLoading } =
    useGetUserWishlist(userEmail);

  // Fallback to [] so .length/.map never run on undefined.
  // (Without `|| []`, wishlistData is undefined until the API responds,
  // and undefined.length throws — which silently breaks rendering.)
  const wishlistData = wishlistResponse?.wishlist || [];

  // ✅ mutation
  const wishlistMutation = useToggleWishlist();

  // ✅ remove wishlist
  const handleWishlistToggle = (bookId) => {
    wishlistMutation.mutate({
      bookId,
      userEmail,
    });
  };

  // ✅ loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ✅ empty state (fixed: "lenght" -> "length")
  if (wishlistData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
        <div className="text-center">
          <p className="text-4xl mb-3">📚</p>
          <h2 className="text-lg font-semibold text-[#2D2219] mb-1">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-gray-500">
            Browse the library and tap the heart on a book to save it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-[#FDFBF7] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#2D2219]">My Wishlist</h1>

        {/* ✅ simple responsive cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistData.map((item) => {
            const book = item.book;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden border border-[#EFECE6] shadow-sm"
              >
                {/* image */}
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />

                {/* content */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-[#2D2219] mb-2">
                    {book.title}
                  </h2>

                  <p className="text-sm text-gray-500 mb-3">{book.author}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#8C6239] font-bold">
                      ${book.fee}
                    </span>

                    <span className="text-xs bg-[#FAF5EC] px-3 py-1 rounded-full">
                      {book.category}
                    </span>
                  </div>

                  {/* buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/details/${book._id}`)}
                      className="flex-1 bg-[#8C6239] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#734f2d]"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => handleWishlistToggle(book._id)}
                      className="px-4 border border-red-200 text-red-500 rounded-xl hover:bg-red-50"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
