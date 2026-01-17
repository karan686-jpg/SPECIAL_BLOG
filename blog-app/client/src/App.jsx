import {Routes,Route} from 'react-router-dom'
import Home from '../pages/Home'

import Layout from '../pages/admin/Layout'
import Dashboard from '../pages/admin/Dashboard'
import AddBlog from '../pages/admin/AddBlog'
import Comments_admin from '../pages/admin/Comments_admin'
import Login from './components/admin/Login'
import BlogDetails from '../pages/BlogDetails'
import ListBlog from '../pages/admin/ListBlog'
import Logout from './components/admin/Logout'

function App() {

  


  return (
    <Routes>
       <Route path='/' element={<Home/>}/>
       <Route path='/blog/:id' element={<BlogDetails />}/>
          
       <Route path='/admin' element={<Layout />}>
            <Route index element={<Dashboard/>}/>
            <Route path='add-blog' element={<AddBlog/>}/>
            <Route path='Listblogs' element={<ListBlog/>}/>
            <Route path='comments' element={<Comments_admin />}/>


       </Route>


       <Route path='/login' element={<Login/>}/>
       <Route path='/logout' element={<Logout/>}/>
      
    
      
    </Routes>
  )
}

export default App
