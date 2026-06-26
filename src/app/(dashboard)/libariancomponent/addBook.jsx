"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AppContext";
// ⚠️ Uploadcare উইজেট ইম্পোর্ট করুন
import { Widget } from "@uploadcare/react-widget";

export default function AddBook() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    router.push("/login");
  }

  const handleAddBookSubmit = async (values, { setSubmitting, resetForm }) => {
    const userString = localStorage.getItem("library-auth-storage");
    let useremail = "";
    if (userString) {
      const parsedUser = JSON.parse(userString);
      useremail = parsedUser?.user?.email || "";
    }

    try {
      // 💡 কোনো FormData লাগবে না! একদম সাধারণ JSON রিকোয়েস্ট
      const response = await fetch("http://localhost:3001/books/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          useremail,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Success: " + data.message);
        resetForm();
      } else {
        alert("Error: " + (data.error || "Failed to submit book"));
      }
    } catch (error) {
      alert("Network error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 font-sans text-[#2D2219]">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight mb-1">
          Add New Book
        </h1>
      </div>

      <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 sm:p-8 shadow-sm">
        <Formik
          initialValues={{
            title: "",
            author: "",
            category: "Fiction",
            fee: "",
            librarian: "",
            date: "",
            image: "", // এটি এখন আবার আগের মতো স্ট্রিং ইউআরএল হিসেবেই থাকবে
          }}
          validate={(values) => {
            const errors = {};
            if (!values.title) errors.title = "Book title is required";
            if (!values.author) errors.author = "Author name is required";
            if (!values.librarian)
              errors.librarian = "Librarian name is required";
            if (!values.image) errors.image = "Book cover image is required";
            if (!values.fee) {
              errors.fee = "Listing fee is required";
            } else if (isNaN(values.fee) || Number(values.fee) < 0) {
              errors.fee = "Please insert a valid numeric fee";
            }
            return errors;
          }}
          onSubmit={handleAddBookSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-5">
              {/* Book Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                  Book Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] rounded-xl px-4 py-2.5 text-sm outline-none"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                  Author Name
                </label>
                <Field
                  type="text"
                  name="author"
                  className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] rounded-xl px-4 py-2.5 text-sm outline-none"
                />
                <ErrorMessage
                  name="author"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Category & Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                    Category
                  </label>
                  <Field
                    as="select"
                    name="category"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-sm outline-none"
                  >
                    <option value="History">History</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Fiction">Fiction</option>
                  </Field>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                    Listing Fee ($)
                  </label>
                  <Field
                    type="text"
                    name="fee"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="fee"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* ⚠️ Uploadcare Widget Field (CHANGED) */}
              <div className="uploadcare-wrapper">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                  Book Cover Image
                </label>
                <div className="p-4 bg-[#FAF5EC] border border-dashed border-[#EFECE6] rounded-xl flex flex-col items-start gap-2">
                  <Widget
                    publicKey="8ec1f2b07934a0d1ce95"
                    id="file"
                    name="image"
                    imagesOnly
                    onChange={(fileInfo) => {
                      if (fileInfo) {
                        // সরাসরি ক্লাউড CDN ইউআরএল Formik-এ সেট হয়ে যাবে
                        setFieldValue("image", fileInfo.cdnUrl);
                      }
                    }}
                  />
                  {values.image && (
                    <p className="text-[11px] text-green-600 font-medium mt-1">
                      ✓ Image uploaded successfully!
                    </p>
                  )}
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Librarian & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                    Assigned Librarian
                  </label>
                  <Field
                    type="text"
                    name="librarian"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="librarian"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                    Publishing Date
                  </label>
                  <Field
                    type="date"
                    name="date"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-sm outline-none text-gray-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2D2219] hover:bg-[#8C6239] text-[#FDFBF7] py-3 rounded-xl font-bold text-xs sm:text-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Publish to Library"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
