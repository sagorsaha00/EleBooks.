'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function OurBestsellers() {
  
  // Stagger variants for grid entry animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 80, damping: 15 } 
    }
  };

  // Mock data matching the exact layout and content of image_18b6dd.png
  const bestsellers = [
    { title: "Of White And Shady", price: "$15.00", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400" },
    { title: "Dune Messiah", price: "$30.00", img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400" },
    { title: "Joker", price: "$46.00", img: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=400" },
    { title: "Peter And The Wolf", price: "$30.00", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400" },
    { title: "She Rises", price: "$15.00", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400" },
    { title: "The Graces", price: "$30.00", img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400" },
    { title: "Bruja Born", price: "$46.00", img: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400" },
    { title: "The Wood", price: "$30.00", img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400" }
  ];

  return (
    <section className="bg-[#FDFBF7] text-[#2D2219] px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto font-sans">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2D2219] tracking-tight">
          Our Bestsellers
        </h2>
      </div>

      {/* 2x4 Grid Configuration (Flattens cleanly on smaller viewports) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6"
      >
        {bestsellers.map((book, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -6 }}
            className="bg-white border border-[#EFECE6] rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
          >
            {/* Aspect Ratio Boxed Book Cover Wrapper */}
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-50 mb-4 border border-gray-100/50">
              <img 
                src={book.img} 
                alt={`Cover of ${book.title}`} 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            
            {/* Book Details metadata */}
            <div className="text-center mt-auto">
              <h3 className="font-bold text-xs sm:text-sm text-[#2D2219] line-clamp-1 mb-1 group-hover:text-[#8C6239] transition-colors">
                {book.title}
              </h3>
              
              {/* Star Rating Layout */}
              <div className="flex justify-center gap-0.5 mb-2 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                ))}
              </div>

              {/* Price Tag */}
              <p className="font-serif font-bold text-xs sm:text-sm text-[#8C6239]">
                {book.price}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}