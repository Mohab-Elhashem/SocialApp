import type { AllPostsResponse, SinglePostResponse } from "@/types/post.types";
import api from "./axios";


export async function getAllPosts(page: number) {

    const { data } = await api.get<AllPostsResponse>('/posts', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            limit: 10,
            page,
            sort: 'createdAt'
        }
    })
    console.log(data, 'getAllPosts');

    return data
}

export async function createPost(formData: FormData) {

    const { data } = await api.post('/posts', formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })

    return data
}

export async function deletePost(postId: string) {

    const { data } = await api.delete(`/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    // console.log(data, 'delete post');

    return data
}

export async function updatePost(postId: string, formData: FormData) {

    const { data } = await api.put(`/posts/${postId}`, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    // console.log(data, 'update post');

    return data
}

export async function getSinglePost(postId: string) {
    const { data } = await api.get<SinglePostResponse>(`/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    console.log(data, 'single post');
    return data
}

export interface LikePostData {
    success: boolean
    message: string
    data: Data
}

export interface Data {
    liked: boolean
    likesCount: number
    post: Post
}

export interface Post {
    _id: string
    body: string
    privacy: string
    user: User
    sharedPost: unknown
    likes: string[]
    createdAt: string
    likesCount: number
    isShare: boolean
    id: string
}

export interface User {
    _id: string
    name: string
    username: string
    photo: string
    followersCount: number
    followingCount: number
    bookmarksCount: number
    id: string
}

// toggleBookmarkPost
export interface BookmarkPostData {
    success: boolean
    message: string
    data: Data
}

export interface Data {
    bookmarked: boolean
    bookmarksCount: number
}


export async function toggleLikePost(postId: string) {
    const { data } = await api.put<LikePostData>(`/posts/${postId}/like`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    console.log(data, 'toggleLikePost');
    return data
}

export async function toggleBookmarkPost(postId: string) {
    const { data } = await api.put<BookmarkPostData>(`/posts/${postId}/bookmark`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    console.log(data, 'toggleBookmarkPost');
    return data
}