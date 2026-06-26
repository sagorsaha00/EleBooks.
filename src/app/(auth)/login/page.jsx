"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLoginMutation } from "../../../lib/getData";
// import { useAuth } from "../../../lib/AppContext";
// import { signIn, getSession } from "../../../lib/auth-client";
import GoogleSignInButton from '../../../../x'

// function GoogleSignInButton() {
//   const { login } = useAuth();

//   const handleGoogleLogin = async () => {
//     try {
//       setLoading(true);
//       const result = await signIn.social({
//         provider: "google",
//         callbackURL: "/",
//         fetchOptions: {
//           onSuccess: async () => {
//             console.log("Login Success");
//             const session = await getSession();
//             console.log("Session:", session);
//             if (session.data?.user) {
//               login(session.data?.user);
//               const res = await fetch(
//                 "http://localhost:3001/users/googleSignIn",
//                 {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify(session.data.user),
//                 },
//               );

//               console.log(await res.json());
//             }
//           },
//         },
//       });

//       console.log(result);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       type="button"
//       onClick={() => handleGoogleLogin}
//       className="w-full flex items-center justify-center gap-3 bg-white border border-[#EFECE6] hover:bg-[#FAF5EC] text-[#2D2219] py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 mb-5 active:scale-[0.99]"
//     >
//       <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
//         <path
//           fill="#4285F4"
//           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//         />
//         <path
//           fill="#34A853"
//           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//         />
//         <path
//           fill="#FBBC05"
//           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
//         />
//         <path
//           fill="#EA4335"
//           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//         />
//       </svg>
//       <span>Continue with Google</span>
//     </button>
//   );
// }

export default function LoginPage() {
  const initialValues = { email: "", password: "" };
  const loginMutation = useLoginMutation();
  const handleSubmit = (values, { resetForm }) => {
    loginMutation.mutate(values);
    resetForm();
  };

  const handleValidation = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  return (
    <section className="bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-[#2D2219]">
      <div className="w-full max-w-5xl bg-white border border-[#EFECE6] rounded-[32px] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
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
            <div className="w-[190px] aspect-[3/4] rounded-2xl shadow-[0_20px_40px_rgba(45,34,25,0.15)] overflow-hidden border-2 border-white/80 rotate-[-3deg]">
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600"
                alt="Ebook Cover Art"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="relative z-10">
            <p className="font-serif italic text-sm text-[#5C4D41] leading-relaxed">
              "Books are a uniquely portable magic."
            </p>
            <span className="block text-[10px] uppercase tracking-widest text-[#8C6239] font-bold mt-1">
              — Stephen King
            </span>
          </div>
        </div>

        {/* Right Form */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight mb-1.5">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Sign in to track your reading workspace and cloud sync.
            </p>
          </div>

          <GoogleSignInButton />

          <div className="flex items-center mb-5 text-[10px] text-gray-400 uppercase tracking-widest select-none">
            <div className="flex-grow border-t border-[#EFECE6]"></div>
            <span className="px-3">Or use credentials</span>
            <div className="flex-grow border-t border-[#EFECE6]"></div>
          </div>

          <Formik
            initialValues={initialValues}
            validate={handleValidation}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="sagor@example.com"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1 font-medium"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239]">
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs font-semibold text-[#8C6239] hover:underline"
                    >
                      Forgot?
                    </a>
                  </div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2D2219] hover:bg-[#8C6239] text-[#FDFBF7] py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Signing In..." : "Sign In Workspace"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-6">
            <p className="text-xs sm:text-sm text-gray-500">
              New to our ecosystem?{" "}
              <a
                href="/register"
                className="font-bold text-[#8C6239] hover:underline"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
