import React from 'react'
 import AppProvider from '../context/AppContext';
import Navbar from '../src/components/Navbar';
import Header from '../src/components/Header';
import { AppContext } from '../context/AppContext';
import BlogList from '../src/components/BlogList';
const Home = () => {
  // const {search,setsearch}=useContext(AppContext);
  return (
    // <input className='search'placeholder='search' value={search}  onChange={(e)=>{setsearch(e.target.value)}}   />
   
   <div> 
    <Navbar/>
    <Header/>
    <section className="blog-section">
  <BlogList />
</section>
    </div>
  );
};

export default Home;
