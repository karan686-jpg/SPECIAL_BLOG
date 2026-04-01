import React from "react";
import Navbar from "../src/components/Navbar";
import Header from "../src/components/Header";
import BlogList from "../src/components/BlogList";
import { Helmet } from "react-helmet-async";
const Home = () => {
  // const {search,setsearch}=useContext(AppContext);
  return (
    // <input className='search'placeholder='search' value={search}  onChange={(e)=>{setsearch(e.target.value)}}   />

    <div>
      <Helmet>
        <title>Blogify | Your Own Blogging Platform</title>
        <meta
          name="description"
          content="Discover stories, thinking, and expertise from writers on any topic. A modern MERN stack blogging platform."
        />
      </Helmet>
      <Navbar />
      <Header />
      <section className="blog-section">
        <BlogList />
      </section>
    </div>
  );
};

export default Home;
