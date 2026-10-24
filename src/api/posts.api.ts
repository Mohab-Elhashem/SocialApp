import api from "./axios";

export interface AllPostsResponse {
    success: boolean
    message: string
    data: Data
    meta: Meta
}

export interface Data {
    posts: Post[]
}

export interface Post {
    _id: string
    image?: string
    privacy: string
    user: User
    sharedPost?: SharedPost
    likes: string[]
    createdAt: string
    body?: string
    commentsCount: number
    topComment?: TopComment
    sharesCount: number
    likesCount: number
    isShare: boolean
    id: string
    bookmarked: boolean
}

export interface User {
    _id: string
    name: string
    username: string
    photo: string
}

export interface SharedPost {
    _id: string
    body: string
    privacy: string
    user: User2
    sharedPost: unknown
    likes: unknown[]
    createdAt: string
    commentsCount: number
    topComment: unknown
    sharesCount: number
    likesCount: number
    isShare: boolean
    id: string
}

export interface User2 {
    _id: string
    name: string
    username: string
    photo: string
}

export interface TopComment {
    _id: string
    content: string
    commentCreator: CommentCreator
    post: string
    parentComment: unknown
    likes: unknown[]
    createdAt: string
    image?: string
}

export interface CommentCreator {
    _id: string
    name: string
    username: string
    photo: string
}

export interface Meta {
    pagination: Pagination
}

export interface Pagination {
    currentPage: number
    numberOfPages: number
    limit: number
    nextPage: number
    total: number
}


export async function getAllPosts() {

    const { data } = await api.get<AllPostsResponse>('/posts',{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        },
        params:{
            limit:10,
            page:1,
            sort:'createdAt'
        }
    })
    console.log(data);

    return data
}