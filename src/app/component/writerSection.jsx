'use client'
import React from "react";
import { motion } from "framer-motion";
import { Award, ArrowRight } from "lucide-react";

export default function AuthorProfileSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 14 },
    },
  };

  const badges = [
    { rank: "#1", name: "Amazex Picks" },
    { rank: "2", name: "THE GROWTH JOURNAL" },
    { rank: "#2", name: "Bookly" },
    { rank: "#1", name: "Audiobooks" },
  ];

  return (
    <section className="bg-[#FDFBF7] text-[#2D2219] px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Top Ticker / Brand Badges */}
        <div className="text-center mb-16">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-6">
            The international bestseller
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 lg:gap-14">
            {badges.map((badge, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="relative w-8 h-8 flex items-center justify-center bg-[#8C6239] text-[#FDFBF7] rounded-full shadow-sm">
                  <Award size={16} className="absolute opacity-20" />
                  <span className="text-[10px] font-black tracking-tighter">
                    {badge.rank}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-tight uppercase text-[#2D2219]">
                  {badge.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Split Grid Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left: Beautifully Rounded Author Image Showcase */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-6 lg:col-span-5 relative aspect-[4/3] sm:aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 bg-gray-100 border border-[#EFECE6]"
          >
            <img
              src="https://cdn.prod.website-files.com/67790760a9a005c4637c00aa/677b9a52d587a37e9a0c73ed_about-image.avif"
              className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700 ease-out"
            />
          </motion.div>

          {/* Right: Metadata Profile Metrics */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-6 lg:col-span-7 flex flex-col items-start text-left md:pl-4"
          >
            <span className="bg-[#E6D5C3]/50 text-[#bea48a] text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
              #1 Bestselling Author
            </span>

            <h2 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#2D2219] mb-6">
              Johan Maxwell
            </h2>

            {/* Profile Meta Breakdown */}
            <div className="space-y-2.5 text-sm sm:text-base text-[#5C4D41] font-medium w-full mb-8">
              <p>
                <span className="font-bold text-[#2D2219]">
                  Specialization:
                </span>{" "}
                Author, Motivational Speaker, and Life Coach
              </p>
              <p>
                <span className="font-bold text-[#2D2219]">Experience:</span>{" "}
                10+ years of experience
              </p>
              <p>
                <span className="font-bold text-[#2D2219]">Publications:</span>{" "}
                10 books
              </p>
            </div>

            <hr className="w-full border-[#EFECE6] mb-8" />

            {/* Quote Block */}
            <blockquote className="w-full mb-8">
              <p className="text-base sm:text-lg font-serif font-bold text-[#2D2219] leading-relaxed italic mb-2">
                "A positive attitude is not just a state of mind; it's a way of
                life that opens doors to endless possibilities."
              </p>
              <cite className="text-xs sm:text-sm not-italic font-semibold text-gray-400 block">
                — Johan Maxwell
              </cite>
            </blockquote>

            {/* CTA Interactive Trigger */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2 bg-[#2D2219] hover:bg-[#423327] text-[#FDFBF7] text-sm font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-black/5"
            >
              <span>Explore story</span>
              <ArrowRight
                size={16}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
