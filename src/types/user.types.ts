import type { Post } from "./post.types"

export interface User {
    _id: string
    name: string
    username: string
    email: string
    dateOfBirth: string
    gender: string
    photo: string
    cover: string
    bookmarks: unknown[]
    followers: unknown[]
    following: unknown[]
    createdAt: string
    followersCount: number
    followingCount: number
    bookmarksCount: number
    id: string
}

export interface ProfileData {
    success: boolean
    message: string
    data: {
        user: User
    }
}

export interface Pagination {
    currentPage: number
    numberOfPages: number
    limit: number
    total: number
    nextPage?: number
}

export interface Meta {
    pagination: Pagination
}

export interface UserPostsData {
    success: boolean
    message: string
    data: {
        posts: Post[]
    }
    meta: Meta
}

export interface Suggestion {
    _id: string
    name: string
    username: string
    photo: string
    mutualFollowersCount: number
    followersCount: number
}

export interface FollowSuggestionsData {
    success: boolean
    message: string
    data: {
        suggestions: Suggestion[]
    }
    meta: Meta
}

export interface FollowUserResponse {
    success: boolean
    message: string
    data: {
        following: boolean
        followersCount: number
    }
}