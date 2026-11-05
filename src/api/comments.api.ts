import type { commentsResponse } from "@/types/comment.types";
import api from "./axios";

export async function getPostComments(postId: string, page: number , limit:number) {
    const { data } = await api.get<commentsResponse>(`/posts/${postId}/comments`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            limit,
            page,
        }
    })
    // console.log(data,'getPostComments');

    return data
}

export async function createComment(postId:string, formData:FormData) {
    const {data} = await api.post(`/posts/${postId}/comments`,formData,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    // console.log(data,'create comment');

    return data
    
}


export async function deleteComment(postId:string,commentId:string) {
    const {data} = await api.delete(`/posts/${postId}/comments/${commentId}`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    // console.log(data,'delete comment');

    return data
    
}


export async function updateComment(postId:string,commentId:string ,formData: FormData) {
    const {data} = await api.put(`/posts/${postId}/comments/${commentId}`,formData,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    // console.log(data,'update comment');

    return data
    
}

