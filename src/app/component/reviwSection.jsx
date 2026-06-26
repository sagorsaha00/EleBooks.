"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const reviewsRow1 = [
  {
    stars: 5,
    title: "Journey worth taking",
    text: "Reading this book felt like embarking on a journey of self-discovery.",
    author: "Emily R",
  },
  {
    stars: 5,
    title: "Motivation around every corner",
    text: "The insights provided are both universally applicable and intimately relatable, offering practical and uplifting advice.",
    author: "Sem J",
  },
  {
    stars: 5,
    title: "A roadmap to personal transformation",
    text: "This book has served as a guiding light, illuminating my path to self-improvement.",
    author: "John M",
  },
  {
    stars: 5,
    title: "A life-changing manual",
    text: "The chapters hit home. It gave me the perfect push back from structural challenges.",
    author: "Johan D",
  },
];

const reviewsRow2 = [
  {
    stars: 5,
    title: "A wealth of insightful guidance",
    text: "This book is a standout among self-help literature, offering clear and practical advice. The strategies provided are not only easy to implement but also profoundly impactful.",
    author: "Martin K",
  },
  {
    stars: 5,
    title: "Inspiration at every turn",
    text: "The lessons are universal yet deeply personal, and the guidance is practical and inspiring.",
    author: "Michael T",
  },
  {
    stars: 5,
    title: "A guide to transform your life",
    text: "This book has been a beacon of light in my growth journey.",
    author: "Sophia M",
  },
];

export default function AnimatedReviewSection() {
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useGSAP(
    () => {
      // Row 1: স্ক্রোল করার সাথে সাথে বাম থেকে ডানে সরবে
      gsap.fromTo(
        row1Ref.current,
        { x: "-10%" },
        {
          x: "10%",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      // Row 2: স্ক্রোল করার সাথে সাথে ডান থেকে বামে সরবে
      gsap.fromTo(
        row2Ref.current,
        { x: "10%" },
        {
          x: "-10%",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    },
    { scope: containerRef },
  );

  const renderStars = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-amber-500 text-sm">
        ★
      </span>
    ));
  };

  return (
    <section
      ref={containerRef}
      className="bg-[#FDFBF7] py-20 overflow-hidden flex flex-col items-center w-full"
    >
      <div className="w-max max-w-[1600px] flex flex-col gap-8 -mx-20">
        {/* Row 1 */}
        <div ref={row1Ref} className="flex gap-6 px-4 will-change-transform">
          {reviewsRow1.map((review, idx) => (
            <div
              key={idx}
              className="bg-[#FAF5EC] p-6 rounded-2xl border border-[#F1E8D9] flex flex-col gap-3 shadow-sm text-[#3d2712] w-[360px] shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(review.stars)}</div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-neutral-700 text-white rounded-full text-[8px] flex items-center justify-center">
                    ✓
                  </span>
                  Verified Reviewer
                </span>
              </div>
              <h3 className="font-bold text-base">{review.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                {review.text}
              </p>
              <span className="font-semibold text-sm mt-2">
                {review.author}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div ref={row2Ref} className="flex gap-6 px-4 will-change-transform">
          {reviewsRow2.map((review, idx) => (
            <div
              key={idx}
              className="bg-[#FAF5EC] p-6 rounded-2xl border border-[#F1E8D9] flex flex-col gap-3 shadow-sm text-[#3d2712] w-[360px] shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(review.stars)}</div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-neutral-700 text-white rounded-full text-[8px] flex items-center justify-center">
                    ✓
                  </span>
                  Verified Reviewer
                </span>
              </div>
              <h3 className="font-bold text-base">{review.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                {review.text}
              </p>
              <span className="font-semibold text-sm mt-2">
                {review.author}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Total Rating */}
      <div className="mt-12 flex items-center gap-2 font-sans text-sm text-gray-800 font-semibold">
        <span className="text-base">4.0</span>
        <div className="flex text-amber-500">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span className="text-gray-300">★</span>
        </div>
        <span className="text-gray-600 font-normal">5426 reviews</span>
      </div>
    </section>
  );
}
