import type { FollowSuggestionsData, FollowUserResponse, ProfileData, UserPostsData } from "@/types/user.types";
import api from "./axios"
import type { ChangePasswordFormData } from "@/lib/changePassword";



export async function getUserProfile() {

    const { data } = await api.get<ProfileData>('/users/profile-data')
    // console.log(data, 'getUserProfile');

    return data
}

export async function getUserPosts(userId: string) {
    const { data } = await api.get<UserPostsData>(`/users/${userId}/posts`)
    // console.log(data, 'getUserPosts');

    return data

}


export async function uploadProfilePhoto(formData: FormData) {
    const { data } = await api.put('/users/upload-photo', formData)
    // console.log(data, 'uploadProfilePhoto');

    return data
}

export async function toggleFollowUser(userId: string) {
    const { data } = await api.put<FollowUserResponse>(`/users/${userId}/follow`, {})
    // console.log(data, 'toggleFollowUser');

    return data
}


export async function getFollowSuggestions() {
    const { data } = await api.get<FollowSuggestionsData>('/users/suggestions?limit=10')
    // console.log(data, 'getFollowSuggestions');

    return data
}

export async function changeMyPassword(formData: ChangePasswordFormData) {
    const {data} = await api.patch("/users/change-password", {
        password: formData.password,
        newPassword: formData.newPassword,
    });
    return data;
}