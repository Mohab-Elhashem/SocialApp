import api from "./axios"

export interface regDataRequest {
    name: string
    username: string
    email: string
    dateOfBirth: string
    gender: string
    password: string
    rePassword: string
}

export interface authResponse {
    success: boolean
    message: string
    data?: Data
    errors?:string
}

export interface Data {
    token: string
    tokenType: string
    expiresIn: string
    user: User
}

export interface User {
    _id: string
    name: string
    username: string
    email: string
    photo: string
    cover: string
}

export interface loginDataRequest {
    email: string
    password: string
}


// signup function (send data)
export async function signup(regData: regDataRequest) {
    const {data} = await api.post<authResponse>('/users/signup', regData) 
    console.log(data);

    return data
}

// login(signin) function
export async function login(loginData:loginDataRequest) {
    const {data} = await api.post<authResponse>('/users/signin',loginData)
    console.log(data);
    
    return data
} 