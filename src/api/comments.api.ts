import type { commentsResponse } from "@/types/comment.types";
import api from "./axios";

export async function getPostComments(postId: string, page: number, limit: number) {
    const { data } = await api.get<commentsResponse>(`/posts/${postId}/comments`, {
        params: {
            limit,
            page,
        }
    })
    // console.log(data,'getPostComments');

    return data
}

export async function createComment(postId: string, formData: FormData) {
    const { data } = await api.post(`/posts/${postId}/comments`, formData)
    // console.log(data,'create comment');

    return data

}


export async function deleteComment(postId: string, commentId: string) {
    const { data } = await api.delete(`/posts/${postId}/comments/${commentId}`)
    // console.log(data,'delete comment');

    return data

}


export async function updateComment(postId: string, commentId: string, formData: FormData) {
    const { data } = await api.put(`/posts/${postId}/comments/${commentId}`, formData)
    // console.log(data,'update comment');

    return data

}


export async function toggleCommentLike(postId: string, commentId: string) {
    const { data } = await api.put(`/posts/${postId}/comments/${commentId}/like`)
    // console.log(data,'toggle CommentLike');

    return data

}


export async function replyToComment(postId: string, commentId: string, formData: FormData) {
    const { data } = await api.post(`/posts/${postId}/comments/${commentId}/replies`, formData)
    // console.log(data,'reply ToComment');

    return data

}

