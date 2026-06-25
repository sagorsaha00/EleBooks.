"use client";

import React, { useState, useEffect } from "react";
import UserDashboard from "../userDashboardComponent/userDashBoard";
import LibrarianDashboard from "../libariancomponent/liberyanDashBoard";
import AdminOverview from "../adminDasboardCmponent/adminOverview";

export default function RoleBasedDashboard() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserRole("librarian");
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
