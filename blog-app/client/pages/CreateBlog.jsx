import React from "react";
import Navbar from "../src/components/Navbar";
import AddBlog from "./admin/AddBlog";

export default function CreateBlog() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white shadow-sm mt-6 rounded-lg mb-10">
        <h1 className="text-3xl font-bold mb-2 ml-10 text-gray-800">
          Write a New Blog
        </h1>
        <p className="text-gray-500 mb-4 ml-10">
          Share your thoughts with the community or generate a draft using AI.
        </p>
        <AddBlog bypassLayout={true} />
      </div>
    </div>
  );
}
