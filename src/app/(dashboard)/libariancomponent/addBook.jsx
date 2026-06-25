"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AppContext";

const handleAddBookSubmit = async (values, { setSubmitting, resetForm }) => {
  // 1. Retrieve and parse the user object from localStorage
  const userString = localStorage.getItem("library-auth-storage")
  const parsedUser = JSON.parse(userString);
  const useremail = parsedUser.user.email;
  console.log(useremail);
  try {
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

export default function AddBook() {
  const router = useRouter(); 
  const {   isLoggedIn } = useAuth();
   if(!isLoggedIn) {
    router.push("/login");
   }
  return (
    <div className="max-w-xl mx-auto py-8 px-4 font-sans text-[#2D2219]">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight mb-1">
          Add New Book
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Publish a premium digital volume to the global library catalog.
        </p>
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
            image: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.title) errors.title = "Book title is required";
            if (!values.author) errors.author = "Author name is required";
            if (!values.librarian)
              errors.librarian = "Librarian name is required";
            if (!values.image)
              errors.image = "Book cover image URL is required";
            if (!values.fee) {
              errors.fee = "Listing fee is required";
            } else if (isNaN(values.fee) || Number(values.fee) < 0) {
              errors.fee = "Please insert a valid numeric fee";
            }
            return errors;
          }}
          onSubmit={handleAddBookSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Book Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                  Book Title
                </label>
                <Field
                  type="text"
                  name="title"
                  placeholder="e.g. History of Tomorrow"
                  className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-medium"
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
                  placeholder="e.g. F. Scott Fitzgerald"
                  className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                />
                <ErrorMessage
                  name="author"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-medium"
                />
              </div>

              {/* Grid System for Category & Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                    Category
                  </label>
                  <Field
                    as="select"
                    name="category"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all cursor-pointer"
                  >
                    <option value="History">History</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Self-Help">Self-Help</option>
                  </Field>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                    Listing Fee ($)
                  </label>
                  <Field
                    type="text"
                    name="fee"
                    placeholder="0.00"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  />
                  <ErrorMessage
                    name="fee"
                    component="div"
                    className="text-red-500 text-xs mt-1 font-medium"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                  Book Cover Image URL
                </label>
                <Field
                  type="text"
                  name="image"
                  placeholder="https://images.unsplash.com/... or any web link"
                  className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-medium"
                />
              </div>

              {/* Grid System for Librarian & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                    Assigned Librarian
                  </label>
                  <Field
                    type="text"
                    name="librarian"
                    placeholder="Sarah Jenkins"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  />
                  <ErrorMessage
                    name="librarian"
                    component="div"
                    className="text-red-500 text-xs mt-1 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
                    Publishing Date
                  </label>
                  <Field
                    type="date"
                    name="date"
                    className="w-full bg-[#FAF5EC] border border-[#EFECE6] focus:border-[#8C6239] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2D2219] hover:bg-[#8C6239] text-[#FDFBF7] py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm disabled:opacity-50 mt-2"
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
