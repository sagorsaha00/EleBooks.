"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  LogIn,
  BookOpen,
  Bookmark,
  Settings,
  Menu,
  X,
  LogOut as LogOutIcon,
} from "lucide-react";
import { signOut } from "../../lib/auth-client";
import { useAuth } from "../../lib/AppContext";
import { useParams, useRouter, usePathname } from "next/navigation";

// ১. usePathname() ব্যবহারকারী আসল কম্পোনেন্ট — নাম পরিবর্তন করে "Content" কম্পোনেন্ট বানানো হলো
function HeaderSectionContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", role: "" });

  // ✅ Auth Session Loading
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("library-auth-storage");
      if (storage) {
        const parsed = JSON.parse(storage);
        if (parsed?.user) {
          setUser(parsed.user);
          setIsLoggedIn(true);
        }
      }
    }
  }, []);

  // ✅ Logout Handler
  const handleLogoutFun = async () => {
    try {
      await signOut();
      logout();
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EFECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between gap-3">
        {/* ─── LOGO ─── */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 bg-[#2D2219] rounded-lg flex items-center justify-center text-[#FDFBF7]">
            <BookOpen size={18} />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#2D2219]">
            Ele<span className="text-[#8C6239]">Books</span>.
          </span>
        </div>

        {/* ─── DESKTOP NAV ─── */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#5C4D41]">
          <span
            onClick={() => router.push("/bookssection")}
            className="hover:text-[#2D2219] transition-colors cursor-pointer"
          >
            Library
          </span>
          <span
            onClick={() => router.push("/#category")}
            className="hover:text-[#2D2219] transition-colors cursor-pointer"
          >
            Categories
          </span>
        </nav>

        {/* ─── RIGHT CONTROLS ─── */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl border border-[#EFECE6] bg-white flex items-center justify-center text-[#2D2219] active:scale-95 transition-transform"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {isLoggedIn ? (
            <>
              {/* ✅ CONDITIONAL DASHBOARD BUTTON (Hides on /dashboard) */}
              {pathname !== "/dashboard" && (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#2D2219] text-[#FDFBF7] hover:bg-[#423327] transition-all shadow-sm active:scale-95"
                >
                  <LayoutDashboard size={16} />
                  <span  className="hidden sm:inline">My Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </button>
              )}

              {/* Profile Dropdown Container */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 cursor-pointer h-10 rounded-full bg-[#EFECE6] border-2 border-[#8C6239] flex items-center justify-center overflow-hidden active:scale-95 transition-transform"
                >
                  <img
                    src={user?.image}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Dropdown Menu Overlay */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-[#EFECE6] rounded-2xl shadow-xl p-2 text-sm text-[#423327] z-50"
                    >
                      <div className="px-3 py-3 border-b border-gray-100 mb-1">
                        <p className="font-bold text-[#2D2219] truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {user?.email}
                        </p>
                        {user.role && (
                          <span className="inline-block text-[10px] bg-[#FAF5EC] text-[#8C6239] border border-[#EFECE6] font-bold px-2 py-0.5 rounded mt-1.5 uppercase tracking-wider">
                            {user?.role}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          router.push("/dashboard");
                          setIsProfileOpen(false);
                        }}
                        className="w-full cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#FDFBF7] transition-colors text-left"
                      >
                        <Bookmark size={16} className="text-gray-400" />
                        Dashbaord
                      </button>

                      <button
                        onClick={() => {
                          handleLogoutFun();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-left font-medium mt-1"
                      >
                        <LogOutIcon size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Sign In Button If Not Authenticated */
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2D2219] text-sm font-semibold text-[#2D2219] hover:bg-[#2D2219] hover:text-[#FDFBF7] transition-all active:scale-95"
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── MOBILE MENU OVERLAY ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#EFECE6] bg-[#FDFBF7] overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1 text-sm font-medium text-[#5C4D41]">
              <span
                onClick={() => {
                  router.push("/");
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-2 hover:bg-[#FAF5EC] rounded-xl cursor-pointer"
              >
                Discover
              </span>
              <span
                onClick={() => {
                  router.push("/bookssection");
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-2 hover:bg-[#FAF5EC] rounded-xl cursor-pointer"
              >
                Library
              </span>
              <span
                onClick={() => {
                  router.push("/#category");
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-2 hover:bg-[#FAF5EC] rounded-xl cursor-pointer"
              >
                Categories
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EFECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between gap-3 h-[60px]">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-[#2D2219] rounded-lg flex items-center justify-center text-[#FDFBF7]">
            <BookOpen size={18} />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#2D2219]">
            Ele<span className="text-[#8C6239]">Books</span>.
          </span>
        </div>
      </div>
    </header>
  );
}

export default function HeaderSection() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderSectionContent />
    </Suspense>
  );
}
