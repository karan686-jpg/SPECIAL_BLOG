import {createContext, useEffect, useState } from "react";

export const AppContext= createContext();

const AppProvider=({children})=>{
    const [user,setuser]=useState(null);
    const [search,setsearch]=useState('');
    const [blogs, setblogs]=useState([]);
    const[isAuth,setisAuth]=useState(false);
    const [token,settoken]=useState(null);
    const [comment,setcomment]=useState({});
  
    useEffect(()=>{
        const savedtoken=localStorage.getItem('token');
        if(savedtoken){
            settoken(savedtoken)
            setisAuth(true);
        }
    },[]);

    return(
        <AppContext.Provider value={{comment,setcomment,token,settoken,user,setuser,search,setsearch,blogs,setblogs,isAuth,setisAuth}}>
            {children}
        </AppContext.Provider>
    )
}
export default AppProvider