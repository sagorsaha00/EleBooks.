"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Mail, Award } from "lucide-react";

const librarians = [
  {
    name: "Artimas Rahman",
    email: "mrartimas24@gmail.com",
    booksApproved: 142,
    badge: "Top Curator",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
  },
  {
    name: "Noah Foster",
    email: "noah.foster@library.com",
    booksApproved: 118,
    badge: "Tech Specialist",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
  },
  {
    name: "Emily Scott",
    email: "emily.scott@library.com",
    booksApproved: 96,
    badge: "Fiction Expert",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
  },
  {
    name: "Daniel Cruz",
    email: "daniel.cruz@library.com",
    booksApproved: 84,
    badge: "Rising Star",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
  },
];

export default function TopLibrarians() {
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
    <section className="bg-[#FDFBF7] text-[#2D2219] px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto font-sans">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2D2219] tracking-tight">
          Top Librarians
        </h2>
        <p className="text-sm sm:text-base text-[#5C4A3A] mt-2 max-w-md mx-auto">
          The curators behind every great recommendation on the shelf
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
      >
        {librarians.map((librarian, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="bg-white border border-[#EFECE6] rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#FDFBF7] shadow-md bg-gray-100">
                <img
                  src={librarian.image}
                  alt={librarian.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#8C6239] text-white rounded-full p-1.5 shadow-sm">
                <Award size={12} />
              </span>
            </div>

            <h3 className="font-bold text-sm sm:text-base text-[#2D2219] mb-1 group-hover:text-[#8C6239] transition-colors">
              {librarian.name}
            </h3>

            <span className="inline-block bg-[#E6D5C3]/40 text-[#8C6239] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full mb-3">
              {librarian.badge}
            </span>

            <div className="flex items-center gap-1.5 text-[#5C4A3A] mb-1.5">
              <BookOpen size={12} />
              <span className="text-xs sm:text-sm font-medium">
                {librarian.booksApproved} books approved
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400">
              <Mail size={11} />
              <span className="text-[11px] sm:text-xs truncate max-w-[150px]">
                {librarian.email}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
