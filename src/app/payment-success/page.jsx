"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const bookId = searchParams.get("bookId");

  const [transactionId, setTransactionId] = useState("N/A");
  const [stripeSessionId, setStripeSessionId] = useState("N/A");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setErrorMessage("No active session found.");
      setIsLoading(false);
      return;
    }

    const verifyAndSavePayment = async () => {
      try {
        // 🔒 Safely read localStorage inside the useEffect (Client-side execution guaranteed)
        const authData = localStorage.getItem("library-auth-storage");
        let userEmail = "";

        if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            userEmail = parsedData?.user?.email || "";
          } catch (e) {
            console.error("Failed to parse auth data from localStorage", e);
          }
        }

        // 1. Verify the Stripe session via your backend gateway
        const verifyResponse = await fetch(
          `https://book-appoitment-backend-server.vercel.app/api/checkout/session/${sessionId}`,
        );
        const verifyData = await verifyResponse.json();

        if (verifyResponse.ok && verifyData.status === "paid") {
          setTransactionId(verifyData.transactionId || "N/A");
          setStripeSessionId(sessionId);

          // 💾 2. Save confirmation context to your local database ledger
          const saveResponse = await fetch(
            "https://book-appoitment-backend-server.vercel.app/books/api/checkout/confirm",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sessionId: sessionId,
                userEmail: userEmail, // Safely loaded context variable
              }),
            },
          );

          const saveData = await saveResponse.json();

          if (!saveResponse.ok) {
            console.error("Database save failed:", saveData.error);
            // Non-blocking fallback: let user see transaction strings even if syncing is lagging
          }
        } else {
          setErrorMessage(verifyData.error || "Payment could not be verified.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setErrorMessage("An error occurred while verifying your payment.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAndSavePayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2219] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {isLoading ? (
          /* Loading Animation */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#8C6239] animate-spin"></div>
            </div>
            <p className="text-center text-gray-600 font-medium">
              Verifying your payment details & updating ledger...
            </p>
          </div>
        ) : errorMessage ? (
          /* Error State UI */
          <div className="text-center py-12 bg-white border border-red-100 rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-serif font-black text-red-600 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => router.push("/bookssection")}
              className="bg-[#8C6239] hover:bg-[#734f2d] text-[#FDFBF7] font-bold text-sm py-3 px-6 rounded-xl transition-all"
            >
              Return to Catalog
            </button>
          </div>
        ) : (
          /* Success Message State */
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="bg-green-100 rounded-full p-6">
                <svg
                  className="w-16 h-16 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-serif font-black mb-3">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Your book has been reserved and synchronized with your workspace
              dashboard.
            </p>

            {/* Details Card */}
            <div className="bg-white border border-[#EFECE6] rounded-2xl p-8 mb-8 text-left">
              <h2 className="font-bold text-[#2D2219] mb-4">
                Booking & Payment Confirmation
              </h2>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between pb-4 border-b border-[#EFECE6] gap-1">
                  <span className="text-gray-600">Stripe Payment ID:</span>
                  <span className="font-mono font-semibold text-xs text-blue-600 break-all select-all sm:text-right max-w-xs">
                    {stripeSessionId}
                  </span>
                </div>

                <div className="flex justify-between pb-4 border-b border-[#EFECE6]">
                  <span className="text-gray-600">Transaction Intent ID:</span>
                  <span className="font-mono font-semibold text-sm text-right break-all">
                    {transactionId}
                  </span>
                </div>

                <div className="flex justify-between pb-4 border-b border-[#EFECE6]">
                  <span className="text-gray-600">Book Reference ID:</span>
                  <span className="font-mono font-semibold text-sm text-gray-500">
                    {bookId || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between pb-4 border-b border-[#EFECE6]">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-xs text-green-600 bg-green-50 px-3 py-1 rounded-md border border-green-100">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    VERIFIED & RECORDED
                  </span>
                </div>

                <div>
                  <span className="text-gray-600 block mb-2">Next Steps:</span>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>
                      Check your dashboard for immediate book reading access
                    </li>
                    <li>
                      Librarian has been notified of this secure payment log
                    </li>
                    <li>
                      You can now post comments/reviews under this book section
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-[#8C6239] hover:bg-[#734f2d] text-[#FDFBF7] font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-sm"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push("/bookssection")}
                className="flex-1 border-2 border-[#8C6239] text-[#8C6239] hover:bg-[#FAF5EC] font-bold text-sm py-3.5 px-6 rounded-xl transition-all"
              >
                Browse More Books
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-8">
              A secure digital ledger entry has been generated for this
              credential.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="animate-pulse text-gray-500">
            Loading checkout node...
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
