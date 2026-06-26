"use client";

import React, { useState } from "react";

export default function AttractivePremiumFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed successfully with: ${email}`);
    setEmail("");
  };


  const socialLinks = [
    {
      name: "Twitter",
      href: "#",
      svg: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
    },
    {
      name: "Github",
      href: "#",
      svg: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
    },
    {
      name: "Linkedin",
      href: "#",
      svg: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" h="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: "Globe",
      href: "#",
      svg: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#2D2219] text-[#FDFBF7] font-sans border-t border-[#423327]">
      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-2 cursor-pointer">
              {/* Custom SVG Book Open Icon */}
              <div className="w-9 h-9 bg-[#8C6239] rounded-xl flex items-center justify-center text-[#FDFBF7]">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#FDFBF7]">
                Ele<span className="text-[#8C6239]">Books</span>.
              </span>
            </div>
            <p className="text-sm text-[#E6D5C3]/70 leading-relaxed max-w-sm">
              Empowering global readers with curated bestselling digital
              volumes, smart progress tracking, and interactive workspace
              modules.
            </p>

            {/* Social Links Layout */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.name}
                  className="w-8 h-8 rounded-lg bg-[#423327] flex items-center justify-center text-[#E6D5C3] hover:bg-[#8C6239] hover:text-[#FDFBF7] transition-all duration-300"
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

        

          {/* Nav Links Column 2 */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#8C6239]">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E6D5C3]/70">
              <li>
                <a href="#" className="hover:text-[#FDFBF7] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FDFBF7] transition-colors">
                  Developer API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FDFBF7] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FDFBF7] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#8C6239]">
              Stay Updated
            </h4>
            <p className="text-sm text-[#E6D5C3]/70 leading-relaxed">
              Subscribe to get release updates, premium coupon drops, and
              personalized author digests.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex bg-[#423327] rounded-xl p-1.5 border border-[#5C4D41]/30"
            >
              <input
                type="email"
                required
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent pl-3 pr-2 text-sm text-[#FDFBF7] placeholder-[#E6D5C3]/40 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#8C6239] hover:bg-[#a17246] text-[#FDFBF7] p-2.5 rounded-lg transition-colors flex items-center justify-center shrink-0"
              >
                {/* SVG Send Icon */}
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Separator Divider Line */}
        <hr className="border-[#423327] my-12" />

        {/* Bottom Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E6D5C3]/50">
          <p>
            © {new Date().getFullYear()} EleBooks Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            {/* SVG Heart Icon */}
            <svg
              className="w-3 h-3 text-red-500 fill-red-500 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span>Sagor Saha</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
