import React from "react";
import Navbar from "../src/components/Navbar";
import AddBlog from "./admin/AddBlog";

export default function CreateBlog() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AddBlog bypassLayout={true} />
      </main>
    </div>
  );
}
