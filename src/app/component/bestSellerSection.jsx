"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL =
  "https://book-appoitment-backend-server.vercel.app/books/allApprovedBooks";

export default function OurBestsellers() {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("loading");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const loadBooks = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const data = await res.json();
        const allBooks = Array.isArray(data?.books) ? data.books : [];

        // Hide anything not actually published, regardless of displayStatus
        const publishedBooks = allBooks.filter(
          (book) => book.status !== "Unpublished",
        );

        // Latest = most recently processed/approved first
        const latestSix = [...publishedBooks]
          .sort(
            (a, b) =>
              new Date(b.processedAt).getTime() -
              new Date(a.processedAt).getTime(),
          )
          .slice(0, 6);

        if (isMounted) {
          setBooks(latestSix);
          setStatus("ready");
        }
      } catch (error) {
        console.error("Failed to load latest books:", error);
        if (isMounted) setStatus("error");
      }
    };

    loadBooks();
    return () => {
      isMounted = false;
    };
  }, []);

  function handlepush(id) {
    router.push(`/details/${id}`);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };

  return (
    <section className="bg-[#FDFBF7] text-[#2D2219] px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto font-sans">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2D2219] tracking-tight">
          Latest Arrivals
        </h2>
        <p className="text-sm sm:text-base text-[#5C4A3A] mt-2">
          Freshly approved titles, added by our librarians
        </p>
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#EFECE6] rounded-2xl p-3 sm:p-4 shadow-sm animate-pulse"
            >
              <div className="aspect-[3/4] w-full rounded-xl bg-[#EFECE6] mb-4" />
              <div className="h-3 bg-[#EFECE6] rounded mb-2 w-3/4 mx-auto" />
              <div className="h-3 bg-[#EFECE6] rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="text-center text-sm text-[#8C6239]">
          Couldn't load the latest arrivals right now. Please try again shortly.
        </p>
      )}

      {status === "ready" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6"
        >
          {books.map((book) => (
            <motion.div
              key={book._id}
              onClick={() => handlepush(book._id)}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="bg-white border border-[#EFECE6] rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-50 mb-4 border border-gray-100/50 relative">
                <img
                  src={`${book.image}?q=80&w=400`}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-[#8C6239] text-white text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full">
                  {book.category}
                </span>
              </div>

              <div className="text-center mt-auto">
                <h3 className="font-bold text-xs sm:text-sm text-[#2D2219] line-clamp-1 mb-1 group-hover:text-[#8C6239] transition-colors">
                  {book.title}
                </h3>

                <div className="flex items-center justify-center gap-1 text-[#8C6239]/70 mb-2">
                  <User size={11} />
                  <span className="text-[11px] sm:text-xs line-clamp-1">
                    {book.author}
                  </span>
                </div>

                <p className="font-serif font-bold text-xs sm:text-sm text-[#8C6239]">
                  ${book.fee.toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {status === "ready" && books.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push("/bookssection")}
            className="group inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#8C6239] hover:text-[#2D2219] transition-colors duration-300"
          >
            <span>View All Books</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      )}
    </section>
  );
}
