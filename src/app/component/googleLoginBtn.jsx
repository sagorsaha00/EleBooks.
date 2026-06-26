"use client";

import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../lib/AppContext";

export default function GoogleLoginBtn() {
  const { isLoggedIn } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;

    try {
      const response = await fetch(
        "https://book-appoitment-backend-server.vercel.app/api/auth/google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: idToken }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        alert(`Welcome back, ${data.user.name}!`);
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth Error:", error);
    }
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  console.log("clientID", clientId);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex justify-center p-4">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
          useOneTap
          theme="outline"
          shape="circle"
        />
      </div>
    </GoogleOAuthProvider>
  );
}
