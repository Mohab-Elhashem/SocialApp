
export interface User {
    _id: string
    name: string
    username: string
    photo: string
}

export interface Post {
    _id: string
    id: string
    body?: string
    image?: string
    privacy: string
    user: User
    sharedPost?: SharedPost | null
    likes: string[]
    createdAt: string
    commentsCount: number
    topComment?: TopComment | null
    sharesCount: number
    likesCount: number
    isShare: boolean
    bookmarked: boolean
}

export interface SharedPost {
    _id: string
    id: string
    body?: string
    privacy: string
    user: User
    sharedPost: unknown
    likes: unknown[]
    createdAt: string
    commentsCount: number
    topComment: unknown
    sharesCount: number
    likesCount: number
    isShare: boolean
}

export interface TopComment {
    _id: string
    content: string
    commentCreator: User
    post: string
    parentComment: unknown
    likes: unknown[]
    createdAt: string
    image?: string
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

export interface AllPostsResponse {
    success: boolean
    message: string
    data: {
        posts: Post[]
    }
    meta: Meta
}

export interface SinglePostResponse {
    success: boolean
    message: string
    data: {
        post: Post
    }
}