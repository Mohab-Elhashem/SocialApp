import type { ReactElement } from "react"
import { Navigate } from "react-router-dom"

export default function AuthGard({children}:{children: ReactElement}) {
    if(localStorage.getItem('token')){
        return <Navigate to='/posts'/>
    }

    return (
        children
    )
}
