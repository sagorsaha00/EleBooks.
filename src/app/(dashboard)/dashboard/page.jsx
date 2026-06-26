"use client";
import React, { useState, useEffect } from "react";
import UserDashboard from "../userDashboardComponent/userDashBoard";
import LibrarianDashboard from "../libariancomponent/liberyanDashBoard";
import AdminOverview from "../adminDasboardCmponent/adminOverview";

export default function RoleBasedDashboard() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("library-auth-storage"))?.user;
    const role = user?.role;
    console.log("role", role);
    setUserRole(role);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-sm font-semibold text-[#8C6239] animate-pulse">
          Loading Workspace Module...
        </p>
      </div>
    );
  }
  console.log("userRole",userRole)

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
