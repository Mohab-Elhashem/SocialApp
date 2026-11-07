export interface User {
    _id: string
    name: string
    username: string
    photo: string
    followersCount?: number
    followingCount?: number
    bookmarksCount?: number
    id?: string
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
    commentsCount?: number
    topComment?: TopComment | null
    sharesCount?: number
    likesCount: number
    isShare: boolean
    bookmarked?: boolean
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
    image?: string;
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

export interface LikePostData {
    success: boolean
    message: string
    data: {
        liked: boolean
        likesCount: number
        post: Post
    }
}

export interface BookmarkPostData {
    success: boolean
    message: string
    data: {
        bookmarked: boolean
        bookmarksCount: number
    }
}

export interface LikedUser {
    _id: string;
    id?: string;
    name: string;
    username: string;
    photo: string;
}

export interface PostLikesResponse {
    success: boolean;
    message: string;
    data: {
        likes: LikedUser[];
    };
    meta: {
        pagination: {
            currentPage: number;
            limit: number;
            total: number;
            numberOfPages: number;
        };
    };
}
