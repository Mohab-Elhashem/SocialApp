import { deleteComment, getPostComments } from "@/api/comments.api"
import { Button } from "@/components/ui/button"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import CreateComment from "./createComment"
import { jwtDecode } from "jwt-decode"
import type { DecodedToken } from "@/features/posts/components/PostCard"
import useUpdateComments from "@/hooks/useUpdateComments"
import { toast } from "sonner"
import { UpdateComment } from "./updateComment"
import { useState } from "react"
import type { Comment } from "@/types/comment.types"
import CommentItem from "./CommentItem"

function getLoggedInUserId() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const decoded: DecodedToken = jwtDecode(token);
        return  decoded.user || null;
    } catch {
        return null;
    }
}


export function Comments({ postId }: { postId: string }) {
    const [editingComment, setEditingComment] = useState<Comment | null>(null);
    const loggedInUserId = getLoggedInUserId();

    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['comments', postId],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => getPostComments(postId, pageParam, 10),
        getNextPageParam: (lastResponse) => {
            const { currentPage, numberOfPages } = lastResponse.meta.pagination;
            if (currentPage >= numberOfPages) {
                return undefined;
            }
            return currentPage + 1;
        }
    });

    const updateComments = useUpdateComments(postId);
    const { mutate } = useMutation({
        mutationFn: (commentId: string) => deleteComment(postId, commentId),
        onSuccess: () => {
            updateComments();
            toast.success("Comment deleted successfully! 🎉");
        },
        onError: () => {
            toast.error("Failed to delete comment");
        }
    });

    if (isLoading) {
        return <p className="text-center py-4 text-muted-foreground">Loading comments...</p>;
    }

    const allComments = data?.pages.flatMap((res) => res.data.comments) || [];

    return (
        <div className="space-y-4 mt-4">
            <CreateComment postId={postId} />

            <div className="space-y-3">
                {allComments.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6">No comments yet. Be the first to comment!</p>
                ) : (
                    allComments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            postId={postId}
                            loggedInUserId={loggedInUserId}
                            onDelete={(commentId) => mutate(commentId)}
                            onEdit={(comment) => setEditingComment(comment)}
                        />
                    ))
                )}
            </div>

            {hasNextPage && (
                <div className="flex justify-center pt-2">
                    <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="w-full sm:w-auto"
                    >
                        {isFetchingNextPage ? "Loading more..." : "Load More Comments"}
                    </Button>
                </div>
            )}

            {editingComment && (
                <UpdateComment 
                    isOpen={!!editingComment} 
                    setIsOpen={(open) => !open && setEditingComment(null)} 
                    allComments={editingComment} 
                    postId={postId}
                />
            )}
        </div>
    );
}