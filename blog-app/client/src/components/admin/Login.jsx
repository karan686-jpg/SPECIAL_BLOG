import React, { useContext, useState } from 'react'
import { AppContext } from '../../../context/AppContext'
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import { toast } from 'react-hot-toast';

const Login = () => {
  const { setisAuth, settoken,axios } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    try{
    const {data}= await axios.post('/api/admin/login',{email,password})
     if(data.success){
      setisAuth(true);
      localStorage.setItem('token', data.token);
      settoken(data.token);
      axios.defaults.headers.common['Authorization']=` ${data.token}`;
      navigate('/admin');
     }
     else{
      toast.error(data.message);
     } 
    }
    catch(error){
      toast.error(error.message);
    }
  }
    

  return (
    <div className='flex items-center justify-center min-h-[80vh]'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-100'>
        <h2 className='text-3xl font-bold text-center mb-2'>
          <span className='text-indigo-600'>Admin</span> <span className='text-black'>Login</span>
        </h2>
        <p className='text-gray-500 text-center mb-8 text-sm'>
          Enter your credentials to access the admin panel
        </p>
        
        <form onSubmit={onSubmitHandler}>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-medium mb-2' htmlFor='email'>Email</label>
                <input 
                    className='appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                    id='email'
                    type='email'
                    placeholder='your email id'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className='mb-8'>
                <label className='block text-gray-700 text-sm font-medium mb-2' htmlFor='password'>Password</label>
                <input 
                    className='appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                    id='password'
                    type='password'
                    placeholder='your password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button 
                className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded w-full focus:outline-none focus:shadow-outline transition-colors'
                type='submit'
            >
                Login
            </button>
        </form>
      </div>
    </div>
  )
}

export default Login; 