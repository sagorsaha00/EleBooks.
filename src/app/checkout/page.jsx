"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AppContext";
import useGetEmailByBookId from "../../lib/getData";

/**
 * Payment action block - initiates the Stripe Checkout session redirect
 */
function PaymentSection({ bookId, fee, title, userEmail, bookOwnerEmail }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckoutRedirect = async (e) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // 1. Call backend endpoint to generate Stripe Checkout URL
      const response = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          price: fee,
          bookTitle: title,
          userEmail,
          bookOwnerEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // 2. Redirect user to Stripe's completely secure hosted interface
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No redirection URL received from checkout endpoint.");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleCheckoutRedirect}
        disabled={isProcessing}
        className="w-full bg-[#8C6239] hover:bg-[#734f2d] disabled:bg-gray-400 text-[#FDFBF7] font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
      >
        {isProcessing
          ? "Redirecting to Secure Payment..."
          : "Proceed to Payment"}
      </button>
    </div>
  );
}

/**
 * Checkout page main component
 */
function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  const bookId = searchParams.get("bookId");
  const fee = parseFloat(searchParams.get("fee")) || 0;
  const title = decodeURIComponent(searchParams.get("title") || "Book");

  // Custom fetch hook
  const { data: librarianData, isLoading } = useGetEmailByBookId(bookId);

  // Auth Protection Redirect
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">
          Loading checkout details...
        </div>
      </div>
    );
  }

  // Safely extract data with an optimal fallback
  const bookOwnerEmail = librarianData?.librarianEmail || "";
  console.log("bookowner enauk", bookOwnerEmail);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2219] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-[#8C6239] hover:underline font-semibold mb-6 flex items-center gap-2"
          >
            ← Back to Book
          </button>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray-500">Secure payment powered by Stripe</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2 bg-white border border-[#EFECE6] rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-6 text-[#2D2219]">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-[#EFECE6]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-[#2D2219]">{title}</p>
                  <p className="text-xs text-gray-500">Book ID: {bookId}</p>
                </div>
                <p className="font-bold text-lg text-[#8C6239]">
                  ${fee.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Render Redirection Actions directly */}
            <PaymentSection
              bookId={bookId}
              fee={fee}
              title={title}
              userEmail={user?.email || ""}
              bookOwnerEmail={bookOwnerEmail}
            />

            {/* Security Info */}
            <div className="mt-6 flex items-start gap-3 text-xs text-gray-600">
              <svg
                className="w-4 h-4 text-green-600 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414L8.586 5l-1.414 1.414L4.878 8.172a1 1 0 000 1.414L7.172 12l1.414-1.414L8.586 12a1 1 0 11-1.414 1.414l-3.293-3.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                Your payment information is encrypted and processed securely by
                Stripe. Your sensitive card details are never stored on our
                servers.
              </p>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 sticky top-6">
              <h3 className="font-bold text-[#2D2219] mb-4">
                Delivery Details
              </h3>

              {/* User Info */}
              <div className="space-y-3 mb-6 pb-6 border-b border-[#EFECE6]">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Recipient
                  </p>
                  <p className="text-sm font-semibold text-[#2D2219]">
                    {user?.name || "User"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-[#2D2219]">
                    {user?.email || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-[#EFECE6]">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Borrowing Fee</span>
                  <span className="font-semibold text-[#2D2219]">
                    ${fee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-semibold text-[#2D2219]">$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#8C6239]">${fee.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-[#FAF5EC] rounded-lg p-3 text-xs text-[#5C4D41]">
                <p className="font-bold mb-2">✓ Instant Delivery</p>
                <p>
                  After successful payment, you'll receive instant access to the
                  book and delivery details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper with Suspense for search params
 */
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading checkout...</div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
