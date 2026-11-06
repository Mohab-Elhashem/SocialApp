import { toggleCommentLike, deleteComment, getCommentReplies, addReply } from "@/api/comments.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ellipsis, Heart, MessageSquare, Loader2, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Comment, CommentItemProps, RepliesResponse } from "@/types/comment.types";


export default function CommentItem({ comment, postId, loggedInUserId, onDelete, onEdit }: CommentItemProps) {
    const queryClient = useQueryClient();
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [replyContent, setReplyContent] = useState<string>("");
    
    const { _id: commentId, content, image, commentCreator, likes, createdAt } = comment;
    const name = commentCreator?.name;
    const photo = commentCreator?.photo;
    const commentCreatorId = commentCreator?._id;

    const { data: repliesData } = useQuery<RepliesResponse>({
        queryKey: ['replies', commentId],
        queryFn: () => getCommentReplies(postId, commentId, 1, 10),
    });

    const replies: Comment[] = repliesData?.data?.replies || comment?.replies || [];

    const { mutate: handleLike, isPending: isLiking } = useMutation<void, Error, void>({
        mutationFn: () => toggleCommentLike(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
        onError: () => {
            toast.error("Failed to update like");
        }
    });

    const { mutate: handleReply, isPending: isSendingReply } = useMutation<RepliesResponse, Error, void>({
        mutationFn: () => addReply(postId, commentId, replyContent),
        onSuccess: (response) => {
            toast.success("Reply added successfully! 💬");
            const newReply = response?.data?.reply;
            
            if (newReply) {
                queryClient.setQueryData<RepliesResponse>(['replies', commentId], (oldData) => {
                    const currentReplies = oldData?.data?.replies || comment?.replies || [];
                    return {
                        ...oldData,
                        data: {
                            ...oldData?.data,
                            replies: [newReply, ...currentReplies]
                        }
                    };
                });
            }
            
            setReplyContent("");
            setIsReplying(false);
            queryClient.invalidateQueries({ queryKey: ['replies', commentId] });
        },
        onError: () => {
            toast.error("Failed to send reply");
        }
    });

    const { mutate: handleDeleteReply } = useMutation<void, Error, string>({
        mutationFn: (replyId: string) => deleteComment(postId, replyId),
        onSuccess: (_, replyId) => {
            toast.success("Reply deleted successfully! 🗑️");
            
            queryClient.setQueryData<RepliesResponse>(['replies', commentId], (oldData) => {
                const currentReplies = oldData?.data?.replies || comment?.replies || [];
                return {
                    ...oldData,
                    data: {
                        ...oldData?.data,
                        replies: currentReplies.filter((reply) => reply._id !== replyId)
                    }
                };
            });

            queryClient.invalidateQueries({ queryKey: ['replies', commentId] });
        },
        onError: () => {
            toast.error("Failed to delete reply");
        }
    });

    const isLikedByMe = loggedInUserId && likes ? likes.includes(loggedInUserId) : false;

    return (
        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={photo} alt={name} />
                        <AvatarFallback>{name?.slice(0, 2).toLocaleUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold text-sm text-foreground">{name}</h4>
                        <span className="text-xs text-muted-foreground">
                            {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
                        </span>
                    </div>
                </div>

                {commentCreatorId === loggedInUserId && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-muted-foreground cursor-pointer">
                            <Ellipsis className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(comment)} className="cursor-pointer">
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(commentId)} className="cursor-pointer text-destructive focus:text-destructive">
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
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleLike()}
                    disabled={isLiking}
                    className={`flex items-center gap-1.5 h-7 px-2 cursor-pointer ${
                        isLikedByMe ? "text-red-500 bg-red-500/10" : "hover:text-red-500 hover:bg-red-500/10"
                    }`}
                >
                    <Heart className={`w-4 h-4 ${isLikedByMe ? "fill-red-500" : ""}`} />
                    <span className="text-xs font-medium">{likes?.length || 0}</span>
                </Button>

                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsReplying(!isReplying)}
                    className="flex items-center gap-1.5 hover:text-primary hover:bg-primary/10 h-7 px-2 cursor-pointer"
                >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-medium">Reply</span>
                </Button>
            </div>

            {isReplying && (
                <div className="pl-12 pt-2 flex gap-2">
                    <Input
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="h-8 text-xs bg-background"
                    />
                    <Button 
                        size="sm" 
                        className="h-8 px-3 text-xs gap-1 cursor-pointer"
                        disabled={isSendingReply || !replyContent.trim()}
                        onClick={() => handleReply()}
                    >
                        {isSendingReply ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        Send
                    </Button>
                </div>
            )}

            {replies && replies.length > 0 && (
                <div className="pl-12 pt-3 space-y-2.5 border-l-2 border-border/40 ml-4">
                    {replies.map((reply: Comment) => {
                        const isReplyOwner = reply?.commentCreator?._id === loggedInUserId;
                        
                        return (
                            <div key={reply._id} className="text-xs space-y-1.5 bg-muted/40 p-3 rounded-lg relative group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-5 h-5">
                                            <AvatarImage src={reply.commentCreator?.photo} alt={reply.commentCreator?.name} />
                                            <AvatarFallback>
                                                {reply.commentCreator?.name?.slice(0, 2).toLocaleUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold text-foreground">
                                            {reply.commentCreator?.name}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-muted-foreground">
                                            {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : ""}
                                        </span>
                                        
                                        {isReplyOwner && (
                                            <button 
                                                onClick={() => handleDeleteReply(reply._id)}
                                                className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                                                title="Delete reply"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-muted-foreground pl-7">{reply.content}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}