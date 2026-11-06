export interface commentsResponse {
    success: boolean;
    message: string;
    data: Data;
    meta: Meta;
}

export interface Data {
    comments: Comment[];
}

export interface Comment {
    _id: string;
    content?: string; 
    image?: string;
    commentCreator: CommentCreator;
    post: string;
    parentComment?: unknown;
    likes: string[]; 
    createdAt: string;
    repliesCount: number;
    replies?: Comment[];
    isReply?: boolean;
}

export interface CommentCreator {
    _id: string;
    name: string;
    username: string; 
    photo: string; 
}

export interface Meta {
    pagination: Pagination;
}

export interface Pagination {
    currentPage: number;
    limit: number;
    total: number;
    numberOfPages: number;
}

export interface CommentItemProps {
    comment: Comment;
    postId: string;
    loggedInUserId: string | null;
    onDelete: (commentId: string) => void;
    onEdit: (comment: Comment) => void;
}

export interface RepliesResponse {
    success?: boolean;
    message?: string;
    data?: {
        replies?: Comment[];
        reply?: Comment;
    };
    comments?: Comment[];
}