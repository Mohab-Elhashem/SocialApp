import api from "./axios"

export interface ProfileData {
    success: boolean
    message: string
    data: Data
}

export interface Data {
    user: User
}

export interface User {
    _id: string
    name: string
    username: string
    email: string
    dateOfBirth: string
    gender: string
    photo: string
    cover: string
    bookmarks: unknown[]
    followers: unknown[]
    following: unknown[]
    createdAt: string
    followersCount: number
    followingCount: number
    bookmarksCount: number
    id: string
}

// getUserPosts types
export interface UserPostsData {
    success: boolean
    message: string
    data: Data
    meta: Meta
}

export interface Data {
    posts: unknown[]
}

export interface Meta {
    pagination: Pagination
}

export interface Pagination {
    currentPage: number
    numberOfPages: number
    limit: number
    total: number
}

// getFollowSuggestions
export interface FollowSuggestionsData {
    success: boolean
    message: string
    data: Data
    meta: Meta
}

export interface Data {
    suggestions: Suggestion[]
}

export interface Suggestion {
    _id: string
    name: string
    username: string
    photo: string
    mutualFollowersCount: number
    followersCount: number
}

export interface Meta {
    pagination: Pagination
}

export interface Pagination {
    currentPage: number
    limit: number
    total: number
    numberOfPages: number
    nextPage: number
}

// toggleFollowUser
export interface FollowUser {
    success: boolean
    message: string
    data: Data
}

export interface Data {
    following: boolean
    followersCount: number
}


export async function getUserProfile() {

    const { data } = await api.get<ProfileData>('/users/profile-data', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    console.log(data, 'getUserProfile');

    return data
}

export async function getUserPosts(userId: string) {
    const { data } = await api.get<UserPostsData>(`/users/${userId}/posts`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    console.log(data, 'getUserPosts');

    return data

}


export async function uploadProfilePhoto(formData: FormData) {
    const { data } = await api.put('/users/upload-photo', formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    console.log(data, 'uploadProfilePhoto');

    return data
}

export async function toggleFollowUser(userId: string) {
    const { data } = await api.put<FollowUser>(`/users/${userId}/follow`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    console.log(data, 'toggleFollowUser');

    return data
}


export async function getFollowSuggestions() {
    const { data } = await api.get<FollowSuggestionsData>('/users/suggestions?limit=10', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    console.log(data, 'getFollowSuggestions');

    return data
}

