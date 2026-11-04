import { deleteComment, getPostComments } from "@/api/comments.api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { Ellipsis, Heart, MessageSquare } from "lucide-react"
import CreateComment from "./createComment"
import { jwtDecode } from "jwt-decode"
import type { DecodedToken } from "@/features/posts/components/PostCard"
import useUpdateComments from "@/hooks/useUpdateComments"
import { toast } from "sonner"
import { UpdateComment } from "./updateComment"
import { useState } from "react"
import type { Comment } from "@/types/comment.types"

function getLoggedInUserId() {
    const { user }: DecodedToken = jwtDecode(localStorage.getItem('token') || '')
    if (user) {
        return user
    }
    return null
}

export function Comments({ postId }: { postId: string }) {
    const [editingComment, setEditingComment] = useState<Comment | null>(null)

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
    })

    const updateComments = useUpdateComments(postId)
    const { mutate } = useMutation({
        mutationFn: (commentId: string) => deleteComment(postId, commentId),
        onSuccess: () => {
            updateComments()
            toast.success("Comment deleted successfully! 🎉");
        },
        onError: () => {
            toast.error("Failed to delete comment");
        }
    })

    if (isLoading) {
        return <p className="text-center py-4 text-muted-foreground">Loading comments...</p>
    }

    const allComments = data?.pages.flatMap((res) => res.data.comments) || [];

    return (
        <div className="space-y-4 mt-4">
            <CreateComment postId={postId} />

            <div className="space-y-3">
                {allComments.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6">No comments yet. Be the first to comment!</p>
                ) : (
                    allComments.map((comment) => {
                        const { _id: commentId, content, image, commentCreator: { name, photo, _id: commentCreatorId }, likes, createdAt } = comment;
                        
                        return (
                            <div key={commentId} className="rounded-xl border border-border/60 bg-card p-4 shadow-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9">
                                            <AvatarImage src={photo} alt={name} />
                                            <AvatarFallback>{name?.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold text-sm text-foreground">{name}</h4>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    {commentCreatorId === getLoggedInUserId() && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <Ellipsis className="w-4 h-4" />
                                                    </Button>
                                                }
                                            />
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setEditingComment(comment)} className="cursor-pointer">
                                                    Update
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => mutate(commentId)} className="cursor-pointer text-destructive focus:text-destructive">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                {content && (
                                    <p className="text-sm text-foreground/90 pl-12">
                                        {content}
                                    </p>
                                )}

                                {image && (
                                    <div className="pl-12 pt-1">
                                        <div className="rounded-xl overflow-hidden border border-border/60 bg-muted/30 max-h-60 max-w-sm flex justify-center p-1">
                                            <img src={image} alt="Comment attachment" className="object-contain max-h-56 rounded-lg" />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-1 border-t pt-2 pl-12">
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-red-500 hover:bg-red-500/10 h-7 px-2">
                                        <Heart className="w-4 h-4" />
                                        <span className="text-xs font-medium">{likes?.length || 0}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-primary hover:bg-primary/10 h-7 px-2">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-xs font-medium">Reply</span>
                                    </Button>
                                </div>
                            </div>
                        );
                    })
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
    )
}