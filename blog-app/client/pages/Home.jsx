import React from "react";
import Navbar from "../src/components/Navbar";
import Header from "../src/components/Header";
import BlogList from "../src/components/BlogList";
import { Helmet } from "react-helmet-async";
const Home = () => {
  // const {search,setsearch}=useContext(AppContext);
  return (
    // <input className='search'placeholder='search' value={search}  onChange={(e)=>{setsearch(e.target.value)}}   />

    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Helmet>
        <title>Blogify | Your Own Blogging Platform</title>
        <meta
          name="description"
          content="Discover stories, thinking, and expertise from writers on any topic. A modern MERN stack blogging platform."
        />
      </Helmet>
      <Navbar />
      <Header />
      <main>
        <BlogList />
      </main>
    </div>
  );
};

export default Home;
