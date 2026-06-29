"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Search, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import HeaderSection from "./headerSection";
import { useSession } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

const SLIDES = [
  {
    eyebrow: "Now Delivering Citywide",
    heading: "Your Local Library, Delivered",
  },
  {
    eyebrow: "50,000+ Titles On Tap",
    heading: "Every Genre, One Doorstep",
  },
  {
    eyebrow: "Free For Cardholders",
    heading: "Skip The Trip",
  },
];

export default function EleBooksResponsiveHero() {
  const headingRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const { data } = useSession();
  const userInfo = data?.user;
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) return;
    const dataCall = async () => {
      try {
        const res = await fetch(
          "https://book-appoitment-backend-server.vercel.app/users/googleSignIn",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo),
          },
        );

        const result = await res.json();
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };

    dataCall();
  }, [userInfo]);

  // Auto-advance the slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!headingRef.current) return;

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
  }, [activeSlide]);

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
  const handlepush = () => {
    router.push("/bookssection");
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

  // Pairs each text slide with one gallery image, so the photo grid
  // highlights in sync with whichever slide is active.
  const featuredIndex = activeSlide % galleryImages.length;

  const slide = SLIDES[activeSlide];

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
        {/* Slider */}
        <div className="relative max-w-3xl mx-auto mb-10 sm:mb-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Eyebrow badge */}
              <div
                className="
                  inline-flex items-center gap-1.5
                  bg-[#E6D5C3]/40
                  text-[#8C6239]
                  rounded-full
                  px-3 py-1
                  text-[11px] sm:text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  mb-6
                "
              >
                <Sparkles size={12} />
                <span>{slide.eyebrow}</span>
              </div>

              {/* Headline (word-stagger animated via gsap) */}
              <h1
                ref={headingRef}
                className="
                  text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                  font-bold
                  leading-tight
                  tracking-tight
                  mb-4
                  px-2
                "
              >
                {slide.heading}
              </h1>

              {/* Supporting copy */}
              <p
                className="
                  text-sm sm:text-base md:text-lg
                  text-[#5C4A3A]
                  max-w-xl
                  mx-auto
                  mb-8
                  px-2
                "
              >
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <button
              onClick={handlepush}
              className="
                group
                cursor-pointer
                inline-flex items-center gap-2
                bg-[#8C6239]
                hover:bg-[#2D2219]
                text-white
                font-semibold
                text-sm sm:text-base
                px-6 sm:px-8
                py-3 sm:py-3.5
                rounded-xl
                transition-all
                duration-300
                shadow-md
                hover:shadow-lg
              "
            >
              <BookOpen size={18} />
              <span>Browse Books</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </motion.div>

          {/* Slide indicators */}
          <div className="flex items-center justify-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="
                  group
                  py-2
                  px-1
                "
              >
                <span
                  className={`
                    block h-1.5 rounded-full transition-all duration-300
                    ${
                      i === activeSlide
                        ? "w-8 bg-[#8C6239]"
                        : "w-3 bg-[#E6D5C3] group-hover:bg-[#D8C3A8]"
                    }
                  `}
                />
              </button>
            ))}
          </div>
        </div>

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
          {galleryImages.map((book, index) => {
            const isFeatured = index === featuredIndex;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                animate={{
                  scale: isFeatured ? 1.06 : 1,
                  opacity: isFeatured ? 1 : 0.55,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{
                  y: -6,
                  scale: isFeatured ? 1.08 : 1.02,
                  opacity: 1,
                }}
                className={`
                  relative
                  rounded-[1.5rem]
                  overflow-hidden
                  shadow-xl
                  border-4
                  bg-gray-100
                  aspect-[3/4]
                  sm:aspect-[3/5]
                  z-0
                  ${isFeatured ? "border-[#8C6239] shadow-2xl z-10" : "border-white"}
                  ${book.isUp ? "md:-translate-y-10" : "md:translate-y-10"}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10" />

                {isFeatured && (
                  <motion.div
                    layoutId="gallery-glow"
                    className="absolute inset-0 ring-4 ring-[#8C6239]/40 rounded-[1.5rem] z-20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                <img
                  src={book.src}
                  alt={`Premium Book ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            );
          })}
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
