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


export async function getCommentReplies(postId: string, commentId: string, page: number, limit: number) {
    const { data } = await api.get(`/posts/${postId}/comments/${commentId}/replies`, {
        params: {
            page,
            limit
        }
    });
    // console.log(data,'getComment Replies');
    return data;
}


export async function addReply(postId: string, commentId: string, content: string) {
    const { data } = await api.post(`/posts/${postId}/comments/${commentId}/replies`, { content });
    // console.log(data,'add Reply');
    return data;
}

