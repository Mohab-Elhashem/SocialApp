import { useState, type ReactElement } from 'react'
import {AuthContext} from "./AuthContext"


export default function AuthContextProvider({ children }: { children: ReactElement }) {
    const [token,setToken] = useState<string|null>(function(){
        return localStorage.getItem('token')
    })
    return (
        <AuthContext.Provider value={{token,setToken}}>
            {children}
        </AuthContext.Provider>
    )
}
