"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; // ✅ Router ইমপোর্ট করা হলো
import axios from "axios";
import {
  Compass,
  Briefcase,
  BookOpen,
  HeartPulse,
  History,
  HelpCircle,
  Feather,
  Atom,
  Laptop,
  Library,
} from "lucide-react";

const fetchCategories = async () => {
  const response = await axios.get("http://localhost:3001/books/allCategory");
  return response.data;
};

const getCategoryIcon = (name) => {
  if (!name) return <Library size={18} />;
  switch (name.toLowerCase()) {
    case "adventure":
      return <Compass size={18} />;
    case "business":
      return <Briefcase size={18} />;
    case "fiction":
      return <BookOpen size={18} />;
    case "health":
      return <HeartPulse size={18} />;
    case "history":
      return <History size={18} />;
    case "mystery":
      return <HelpCircle size={18} />;
    case "poetry":
      return <Feather size={18} />;
    case "science":
      return <Atom size={18} />;
    case "technology":
      return <Laptop size={18} />;
    default:
      return <Library size={18} />;
  }
};

export default function CategoriesSection() {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categoriesArray = data?.data || [];

  const handleCategoryClick = (categoryName) => {
    //http://localhost:3000/bookssection?category=Fiction
    router.push(`/bookssection?category=${encodeURIComponent(categoryName)}`, {
      scroll: false,
    });
  };

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

  if (isLoading)
    return (
      <div className="py-20 text-center text-[#8C6239] font-serif italic animate-pulse">
        Loading categories...
      </div>
    );
  if (isError)
    return (
      <div className="py-20 text-center text-red-500 text-sm">
        Failed to load categories.
      </div>
    );

  return (
    <section id="category" className="py-6">
      <div className="text-center md:text-left mb-10">
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2D2219] tracking-tight">
          Countless Categories
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[100px]"
      >
        {categoriesArray.map((categoryName, idx) => {
          const isLargeCell = idx === 2 || idx === 3;
          const sizeClass = isLargeCell
            ? idx === 2
              ? "col-span-1 row-span-2 bg-[#F3EFF6]"
              : "col-span-1 row-span-2 bg-[#F5F2EB]"
            : "col-span-1 bg-[#F7F5EE]";

          return (
            <motion.div
              key={categoryName || idx}
              variants={cardVariants}
              whileHover={{ scale: 1.015 }}
              onClick={() => handleCategoryClick(categoryName)}
              className={`
                ${sizeClass} p-5 rounded-2xl border border-[#EFECE6] flex transition-all cursor-pointer
                ${isLargeCell ? "flex-col justify-end items-start h-[216px]" : "items-center gap-4 h-[100px]"}
              `}
            >
              <div
                className={`p-3 rounded-xl flex items-center justify-center text-[#8C6239] shadow-sm ${isLargeCell ? "bg-white/80 mb-auto" : "bg-white"}`}
              >
                {getCategoryIcon(categoryName)}
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#2D2219]">
                  {categoryName}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">1200+ Books</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
