import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

export default function PostsGuard({children}:{children:ReactElement}) {
    if(localStorage.getItem('token')){
        return children
    }
    
    return <Navigate to='/login'/>
}
