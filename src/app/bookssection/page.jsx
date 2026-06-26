"use client";

import React, { useState, useEffect } from "react";
import { useGetAllApprovedBooks } from "@/lib/getData";
import { useSearchParams, usePathname } from "next/navigation";
import HeaderSection from "../component/headerSection";
import AttractivePremiumFooter from "../component/footerSection";
import Link from "next/link";

export default function BookSectionWithFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryCategory = searchParams.get("category");

  // ─── 📝 Instant Input States (ইউজার টাইপ বা সিলেক্ট করার সাথে সাথে চেঞ্জ হবে) ───
  const [searchQuery, setSearchQuery] = useState("");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  // ─── ⏱️ Debounced States (২ সেকেন্ড পর এই স্টেটগুলো আপডেট হয়ে সার্ভারে কল যাবে) ───
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: "",
    minFee: "",
    maxFee: "",
  });

  const categories = [
    "All",
    "Adventure",
    "Business",
    "Fiction",
    "Health",
    "History",
    "Mystery",
    "Poetry",
    "Science",
    "Technology",
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_low_high", label: "Price: Low → High" },
    { value: "price_high_low", label: "Price: High → Low" },
    { value: "name_a_z", label: "Name: A → Z" },
    { value: "name_z_a", label: "Name: Z → A" },
  ];

  // ─── 🔄 গ্লোবাল ২ সেকেন্ড ডিবান্স লজিক (সার্চ এবং ফি রেঞ্জের জন্য) ───
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({
        search: searchQuery,
        minFee: minFee,
        maxFee: maxFee,
      });
      setCurrentPage(1); // যেকোনো ফিল্টার চেঞ্জ হলে পেজ ১ এ চলে যাবে
    }, 2000); // ২ সেকেন্ড (2000ms) ডিলে

    return () => clearTimeout(timer);
  }, [searchQuery, minFee, maxFee]); // এই ৩টি স্টেটের যেকোনো একটি চেঞ্জ হলেই টাইমার রিসেট হবে

  // ─── URL Query Sync ───
  useEffect(() => {
    if (queryCategory) {
      const matchedCategory = categories.find(
        (cat) => cat.toLowerCase() === queryCategory.toLowerCase(),
      );
      setActiveCategory(matchedCategory || queryCategory);
      setCurrentPage(1);
    }
  }, [queryCategory]);

  // ─── Fetch Data (ডেবউন্সড ফিল্টার + ইনস্ট্যান্ট সর্ট/ক্যাটাগরি) ───
  const { data, isLoading, isFetching, isError } = useGetAllApprovedBooks({
    search: debouncedFilters.search,
    minFee: debouncedFilters.minFee,
    maxFee: debouncedFilters.maxFee,
    sortBy, // ক্লিক করলেই ইনস্ট্যান্টলি কাজ করবে, ডিবাউন্স লাগবে না
    category: activeCategory, // ক্যাটাগরি বাটনে ক্লিক করলে সেটাও ইনস্ট্যান্টলি কাজ করবে
    page: currentPage,
    limit: booksPerPage,
  });

  const books = data?.books || [];
  const pagination = data?.pagination || { totalPages: 1, currentPage: 1 };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
    const params = new URLSearchParams(window.location.search);
    params.set("category", category);
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // চেক করা হচ্ছে কোনো ফিল্টার বর্তমানে পেন্ডিং বা ডেবউন্স অবস্থায় আছে কি না
  const isFilterPending =
    searchQuery !== debouncedFilters.search ||
    minFee !== debouncedFilters.minFee ||
    maxFee !== debouncedFilters.maxFee;

  // ─── শুধুমাত্র প্রথমবার লোডের সময় ফুল-পেজ লোডার দেখাবে ───
  if (isLoading && !data)
    return (
      <div className="py-16 text-center font-semibold text-gray-500">
        Loading Library Books...
      </div>
    );
  if (isError)
    return (
      <div className="py-16 text-center text-red-500">
        Failed to load library resources.
      </div>
    );

  return (
    <>
      <HeaderSection></HeaderSection>
      <section
        id="book-explore"
        className="bg-[#FDFBF7] text-[#2D2219] px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto font-sans target:scroll-mt-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight mb-3">
            Explore Our Library
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Find your next favorite read using our advanced smart filters.
          </p>

          {/* ⏳ গ্লোবাল পেন্ডিং ইন্ডিকেটর (টাইপিং / ফি ফিল্টারের জন্য) */}
          {isFilterPending && (
            <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full animate-pulse mt-3 inline-block font-medium">
              Updating results in 2 seconds...
            </span>
          )}

          {/* ⏳ সর্ট / ক্যাটাগরি / পেজিনেশনের জন্য সাবটল রিফ্রেশ ইন্ডিকেটর */}
          {!isFilterPending && isFetching && !isLoading && (
            <span className="text-xs text-gray-400 mt-3 inline-block font-medium">
              Refreshing...
            </span>
          )}
        </div>

        {/* ─── ADVANCED FILTER PANEL ─── */}
        <div className="bg-white border border-[#EFECE6] p-6 rounded-2xl shadow-sm mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                Search Book Name / Author
              </label>
              <input
                type="text"
                placeholder="Type title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFECE6] text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6239]/40"
              />
            </div>

            {/* Delivery Fee Range */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                Delivery Fee Range ($)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minFee}
                  onChange={(e) => setMinFee(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EFECE6] text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6239]/40"
                />
                <span className="text-gray-400 text-sm">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxFee}
                  onChange={(e) => setMaxFee(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EFECE6] text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6239]/40"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFECE6] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6239]/40 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ─── CATEGORY BADGES ─── */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory.toLowerCase() === category.toLowerCase()
                  ? "bg-[#8C6239] text-[#FDFBF7] shadow-sm"
                  : "bg-white border border-[#EFECE6] text-[#2D2219] hover:bg-[#FAF5EC]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ─── BOOKS GRID ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {books.map((book) => (
            <Link
              href={`/details/${book._id}`}
              key={book._id}
              className="bg-white border border-[#EFECE6] rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-50 mb-4 border border-gray-100">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-center mt-auto">
                <span className="inline-block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  {book.category}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-[#2D2219] line-clamp-1 mb-0.5 group-hover:text-[#8C6239]">
                  {book.title}
                </h3>
                <p className="text-[11px] text-gray-400 mb-1.5 line-clamp-1">
                  by {book.author}
                </p>
                <div className="flex justify-end items-center mt-2 border-t border-gray-50 pt-2">
                  <p className="font-serif font-bold text-xs sm:text-sm text-[#8C6239]">
                    ${Number(book.fee).toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm font-medium">
              No books match your criteria at this moment.
            </p>
          </div>
        )}

        {/* ─── SERVER-SIDE PAGINATION ─── */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 border-t border-[#EFECE6] pt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#EFECE6] disabled:opacity-40 transition-colors hover:bg-[#FAF5EC] cursor-pointer"
            >
              Prev
            </button>
            <span className="text-xs font-medium text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.totalPages),
                )
              }
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#EFECE6] disabled:opacity-40 transition-colors hover:bg-[#FAF5EC] cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </section>
      <AttractivePremiumFooter></AttractivePremiumFooter>
    </>
  );
}
