import type { authResponse, loginDataRequest, regDataRequest } from "@/types/auth.types"
import api from "./axios"


export async function signup(regData: regDataRequest) {
    const {data} = await api.post<authResponse>('/users/signup', regData) 
    // console.log(data,'register');

    return data
}

export async function login(loginData:loginDataRequest) {
    const {data} = await api.post<authResponse>('/users/signin',loginData)
    // console.log(data,'login');
    
    return data
} 