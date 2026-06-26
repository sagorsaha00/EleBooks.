"use client";

import React, { useState } from "react";

export default function BookCard({ book, userEmail }) {
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://book-appoitment-backend-server.vercel.app/api/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId: book.id,
            bookTitle: book.title,
            price: book.price,
            userEmail: userEmail,
          }),
        },
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment initialization failed");
      }
    } catch (error) {
      console.error("Payment Click Error:", error);
      alert("Failed to connect to checkout server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#EFECE6] p-5 rounded-2xl bg-white max-w-sm">
      <h3 className="font-serif font-bold text-lg mb-1">{book.title}</h3>
      <p className="text-sm text-[#8C6239] font-bold mb-4">${book.price}</p>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-[#2D2219] hover:bg-[#8C6239] text-white py-2.5 rounded-xl font-bold transition-all text-sm disabled:opacity-50"
      >
        {loading ? "Processing..." : "Buy Now with Stripe"}
      </button>
    </div>
  );
}
