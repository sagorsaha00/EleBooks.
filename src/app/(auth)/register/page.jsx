"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../lib/AppContext";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "../../../../x"

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  // 📡 TanStack Query Mutation ফর রেগুলার রেজিস্ট্রেশন
  const registerMutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await fetch("http://localhost:3001/users/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      return data;
    },
    onSuccess: (data) => {
      console.log("data", data);
      login(data.user); 
      alert(`Account created successfully as`);
      router.push("/dashboard");
    },
    onError: (error) => {
      alert(error.message || "Something went wrong.");
    },
  });

  const initialValues = {
    name: "",
    email: "",
    picUrl: "",
    password: "",
    role: "user",
  };

  const handleSubmit = (values, { resetForm }) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        resetForm();
      },
    });
  };

  const handleValidation = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Full Name is required";
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.picUrl) {
      errors.picUrl = "Profile Picture URL is required";
    } else if (!/^https?:\/\/.+/i.test(values.picUrl)) {
      errors.picUrl = "Please provide a valid link";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <section className="bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-[#2D2219]">
      <div className="w-full max-w-5xl bg-white border border-[#EFECE6] rounded-[32px] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        {/* Left Banner */}
        <div className="hidden md:flex md:col-span-5 relative bg-[#FAF5EC] p-8 flex-col justify-between overflow-hidden border-r border-[#EFECE6]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#8C6239]/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 bg-[#8C6239] rounded-lg flex items-center justify-center text-[#FDFBF7]">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="text-md font-bold tracking-tight">
              Ele<span className="text-[#8C6239]">Books</span>.
            </span>
          </div>

          <div className="my-auto relative flex justify-center py-6">
            <div className="w-[190px] aspect-[3/4] rounded-2xl shadow-[0_20px_40px_rgba(45,34,25,0.15)] overflow-hidden border-2 border-white/80 rotate-[3deg]">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600"
                alt="Ebook Registration Concept Art"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="relative z-10">
            <p className="font-serif italic text-sm text-[#5C4D41] leading-relaxed">
              "The hold of books on us is shared by no other digital medium."
            </p>
            <span className="block text-[10px] uppercase tracking-widest text-[#8C6239] font-bold mt-1">
              — Platform Standard
            </span>
          </div>
        </div>

        {/* Right Form */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-5">
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight mb-1.5">
              Create Account
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Register a free profile to begin parsing elite publications.
            </p>
          </div>

          {/* Google SSO Button */}
          <GoogleSignInButton />

          <div className="flex items-center mb-4 text-[10px] text-gray-400 uppercase tracking-widest select-none">
            <div className="flex-grow border-t border-[#EFECE6]"></div>
            <span className="px-3">Or regular setup</span>
            <div className="flex-grow border-t border-[#EFECE6]"></div>
          </div>

          <Formik
            initialValues={initialValues}
            validate={handleValidation}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-0.5">
                    Full Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Sagor Saha"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2 text-sm outline-none transition-all placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-0.5">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="sagor@example.com"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2 text-sm outline-none transition-all placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-0.5"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-0.5">
                    Profile Picture URL
                  </label>
                  <Field
                    type="text"
                    name="picUrl"
                    placeholder="https://images.unsplash.com/...jpg"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2 text-sm outline-none transition-all placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="picUrl"
                    component="div"
                    className="text-red-500 text-xs mt-0.5"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-0.5">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2 text-sm outline-none transition-all placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-0.5"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-0.5">
                    Workspace Role
                  </label>
                  <Field
                    as="select"
                    name="role"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2 text-sm outline-none transition-all cursor-pointer"
                  >
                    <option value="user">User (Reader Mode)</option>
                    <option value="librarian">Librarian (Publish Mode)</option>
                  </Field>
                </div>

                {/* Conditional Info Card */}
                <div className="bg-[#FAF5EC]/70 border border-dashed border-[#8C6239]/20 rounded-xl p-2.5 flex items-start gap-2">
                  <div className="text-[#8C6239] mt-0.5 shrink-0">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <p className="text-[11px] text-[#5C4D41] leading-relaxed">
                    {values.role === "librarian" ? (
                      <span>
                        Authorized as a <strong>Librarian</strong>: You can
                        fully <strong>publish</strong>, serialize, and maintain
                        administrative digital media metadata.
                      </span>
                    ) : (
                      <span>
                        Authorized as a <strong>Reader</strong>: You can check
                        out, bookmark, take logs, and natively{" "}
                        <strong>read</strong> any textbook directly.
                      </span>
                    )}
                  </p>
                </div>

                {/* ⚡ registerMutation.isPending দিয়ে বাটন স্টেট লোডিং হ্যান্ডেল হচ্ছে */}
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-[#2D2219] hover:bg-[#8C6239] text-[#FDFBF7] py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 mt-1 disabled:opacity-50"
                >
                  {registerMutation.isPending
                    ? "Processing..."
                    : "Register Credentials"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-4">
            <p className="text-xs sm:text-sm text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-bold text-[#8C6239] hover:underline"
              >
                Sign In Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
