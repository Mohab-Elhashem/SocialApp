import type { AllPostsResponse, BookmarkPostData, LikePostData, SinglePostResponse } from "@/types/post.types";
import api from "./axios";


export async function getAllPosts(page: number) {

    const { data } = await api.get<AllPostsResponse>('/posts', {
        params: {
            limit: 10,
            page,
            // sort: 'createdAt'
        }
    })
    // console.log(data, 'getAllPosts');

    return data
}

export async function createPost(formData: FormData) {

    const { data } = await api.post('/posts', formData)

    return data
}

export async function deletePost(postId: string) {

    const { data } = await api.delete(`/posts/${postId}`)
    // console.log(data, 'delete post');

    return data
}

export async function updatePost(postId: string, formData: FormData) {

    const { data } = await api.put(`/posts/${postId}`, formData)
    // console.log(data, 'update post');

    return data
}

export async function getSinglePost(postId: string) {
    const { data } = await api.get<SinglePostResponse>(`/posts/${postId}`)
    // console.log(data, 'single post');
    return data
}

export async function toggleLikePost(postId: string) {
    const { data } = await api.put<LikePostData>(`/posts/${postId}/like`, {})
    // console.log(data, 'toggleLikePost');
    return data
}

export async function toggleBookmarkPost(postId: string) {
    const { data } = await api.put<BookmarkPostData>(`/posts/${postId}/bookmark`, {})
    // console.log(data, 'toggleBookmarkPost');
    return data
}

export async function sharePost(postId: string){
    const {data} = await api.post(`/posts/${postId}/share`)
    // console.log(data,'share Post');
    return data
}