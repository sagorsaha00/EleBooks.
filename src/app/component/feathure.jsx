"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CategoriesSection from "./categoriesSection";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function FeaturedAndCategories() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://book-appoitment-backend-server.vercel.app/books/getAllBook",
        );
        if (response.data.data) {
          console.log("data", response.data.data);
          setBooks(response.data.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching books from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };

  return (
    <div className="bg-[#FDFBF7] text-[#2D2219] px-4 sm:px-6 lg:px-8 py-16 space-y-24 max-w-6xl mx-auto font-sans">
      <section>
        <div className="text-center md:text-left mb-10 flex items-center justify-between">
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2D2219] tracking-tight">
            Books Section
          </h2>

          <Link
            href="/bookssection"
            className="bg-[#2D2219] hover:bg-[#423327] rounded-full px-4 py-2 border-2 text-sm font-medium text-white flex items-center gap-1 cursor-pointer"
          >
            see all
            <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-10 font-medium text-gray-500">
            Loading books...
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          >
            {books.map((book) => (
              <Link
                href={`/details/${book._id}`}
                key={book._id}
                className="block group"
              >
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  className="bg-white border border-[#EFECE6] rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between cursor-pointer"
                >
                  <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="text-center">
                    <h3 className="font-bold text-sm sm:text-base text-[#2D2219] line-clamp-1 mb-1">
                      {book.title}
                    </h3>

                    {/* Hardcoded 5 Gold Rating Stars as requested by UI design */}
                    <div className="flex justify-center gap-0.5 mb-1.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>

                    <p className="font-serif font-bold text-xs sm:text-sm text-[#8C6239]">
                      ${book.fee}.00{" "}
                      {/* Maps to "fee" from your MongoDB schema */}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </section>

      <CategoriesSection />
    </div>
  );
}
