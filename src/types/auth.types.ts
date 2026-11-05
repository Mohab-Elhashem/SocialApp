
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
    errors?: string
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