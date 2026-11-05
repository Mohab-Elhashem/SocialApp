import type { FollowSuggestionsData, FollowUserResponse, ProfileData, UserPostsData } from "@/types/user.types";
import api from "./axios"



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
    const { data } = await api.put<FollowUserResponse>(`/users/${userId}/follow`, {}, {
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

