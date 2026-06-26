"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Search, Sparkles } from "lucide-react";
import HeaderSection from "./headerSection";
import { useSession } from "../../lib/auth-client";

export default function EleBooksResponsiveHero() {
  const headingRef = useRef(null);

  const { data } = useSession();
  const userInfo = data?.user;

  useEffect(() => {
    if (!userInfo) return;

    const dataCall = async () => {
      try {
        const res = await fetch("https://book-appoitment-backend-server.vercel.app/users/googleSignIn", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        });

        const result = await res.json();
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };

    dataCall();
  }, [userInfo]);

  useEffect(() => {
    if (headingRef.current) {
      const text = headingRef.current.innerText;
      const words = text.split(" ");

      headingRef.current.innerHTML = "";

      words.forEach((word) => {
        const span = document.createElement("span");

        span.innerText = word + " ";
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(25px)";

        headingRef.current.appendChild(span);
      });

      gsap.to(headingRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.1,
      });
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const galleryImages = [
    {
      src: "https://demo.assets.templately.com/woo/elementor/9/2024/03/cac54461-eb-skew-img-1.png",
      isUp: false,
    },
    {
      src: "https://demo.assets.templately.com/woo/elementor/9/2024/03/64f0f894-eb-skew-img-2.png",
      isUp: false,
    },
    {
      src: "https://demo.assets.templately.com/woo/elementor/9/2024/03/936b6701-eb-skew-img-3.png",
      isUp: true,
    },
    {
      src: "https://demo.assets.templately.com/woo/elementor/9/2024/03/cfde8b94-eb-skew-img-4.png",
      isUp: true,
    },
  ];

  return (
    <div className="overflow-x-hidden bg-[#FDFBF7] text-[#2D2219] font-sans antialiased selection:bg-[#E6D5C3]">
      {/* HEADER */}
      <HeaderSection />

      {/* MAIN */}
      <main
        className="
  max-w-7xl
  mx-auto
  px-4 sm:px-6 lg:px-8
  pt-10 sm:pt-14 md:pt-20
  pb-16 sm:pb-24
  text-center
  overflow-hidden
"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            inline-flex items-center gap-1.5
            bg-[#E6D5C3]/40
            text-[#8C6239]
            rounded-full
            text-[11px] sm:text-xs
            font-semibold
            uppercase
            tracking-wider
            mb-6
          "
        >
          <Sparkles size={12} />
          <span>The Definitive Digital Collection 📚</span>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="
            flex items-center
            w-full
            max-w-2xl
            mx-auto
            bg-white
            border border-[#EFECE6]
            shadow-md
            rounded-2xl
            p-2
            mb-16 sm:mb-24
          "
        >
          <input
            type="text"
            placeholder="Search Your Next Volume..."
            className="
              flex-1
              min-w-0
              px-3 sm:px-5
              py-3
              text-sm sm:text-base
              text-[#2D2219]
              placeholder-gray-400
              bg-transparent
              focus:outline-none
            "
          />

          <button
            className="
              shrink-0
              bg-[#8C6239]
              hover:bg-[#2D2219]
              text-white
              p-3 sm:px-5
              rounded-xl
              transition-all
              duration-300
              flex items-center justify-center
              shadow-sm
            "
          >
            <Search size={18} />
          </button>
        </motion.div>

        {/* Gallery */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4 sm:gap-6
            max-w-6xl
            mx-auto
            mb-20 md:mb-28
            items-center
          "
        >
          {galleryImages.map((book, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className={`
                relative
                rounded-[1.5rem]
                overflow-hidden
                shadow-xl
                border-4 border-white
                bg-gray-100
                aspect-[3/4]
                sm:aspect-[3/5]
                ${book.isUp ? "md:-translate-y-10" : "md:translate-y-10"}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10" />

              <img
                src={book.src}
                alt={`Premium Book ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-4 sm:gap-5
            max-w-6xl
            mx-auto
            text-left
          "
        ></motion.div>
      </main>
    </div>
  );
}
