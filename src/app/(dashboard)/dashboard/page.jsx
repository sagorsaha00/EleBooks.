"use client";

import React, { useState, useEffect } from "react";
import UserDashboard from "../userDashboardComponent/userDashBoard";
import LibrarianDashboard from "../libariancomponent/liberyanDashBoard";
import AdminOverview from "../adminDasboardCmponent/adminOverview";
import { useRouter } from "next/navigation";

export default function RoleBasedDashboard() {
  const [userRole, setUserRole] = useState(null);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("library-auth-storage");
    if (!userString) {
      router.push("/login");

      return;
    }

    try {
      const parsedUser = JSON.parse(userString);
      if (parsedUser?.user) {
        console.log("xxx", parsedUser?.user.role);
        setUserRole(parsedUser?.user?.role);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error parsing auth storage", error);

      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-sm font-semibold text-[#8C6239] animate-pulse">
          Loading Workspace Module...
        </p>
      </div>
    );
  }

  console.log("userRole", userRole);

  switch (userRole) {
    case "admin":
      return <AdminOverview />;

    case "librarian":
      return <LibrarianDashboard />;

    case "user":
    default:
      return <UserDashboard />;
  }
}
