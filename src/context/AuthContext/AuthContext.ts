import { createContext } from "react";

interface AuthContextValues{
    token: string|null
    setToken:(t:string)=>void
}

export const AuthContext = createContext<AuthContextValues>({token:null,setToken:()=>{}})