import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/shared/Container";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, MessageSquare } from "lucide-react";
import { deletePost } from "@/api/posts.api";
import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";
import useUpdatePosts from "@/hooks/useUpdatePosts";
import { toast } from "sonner";
import { UpdatePost } from "./UpdatePost";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Post } from "@/types/post.types";
import { FollowButton } from "@/components/FollowButton";
import LikeButton from "@/components/LikeButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import ShareButton from "./ShareButton";
import PostLikesModal from "./PostLikesModal";

export interface DecodedToken {
    user: string;
    iat: number;
    exp: number;
    aud: string;
    iss: string;
}

export default function PostCard({ post }: { post: Post }) {
    const [isOpen, setIsOpen] = useState(false);

    const { user, body, id: postId, image: postImage, commentsCount, sharedPost, isShare } = post;
    const name = user?.name;
    const photo = user?.photo;
    const username = user?.username;
    const postCreateId = user?._id;

    const { user: loggedUser } = jwtDecode<DecodedToken>(localStorage.getItem('token') || '');

    function handleDelete() {
        return deletePost(postId);
    }

    const updatePosts = useUpdatePosts();
    const { mutate } = useMutation({
        mutationFn: handleDelete,
        onSuccess: () => {
            updatePosts();
            toast.success("Post deleted successfully! 🎉");
        },
        onError: (err) => {
            console.log(err);
        }
    });

    return (
        <Container className="mx-auto py-3">
            <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 transition-all">

                {/* Header */}
                <header className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="w-10 h-10 shrink-0">
                            <AvatarImage src={photo} alt={name} />
                            <AvatarFallback>{name?.slice(0, 2).toLocaleUpperCase() || "U"}</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="font-semibold text-sm text-foreground truncate">{name}</span>
                                <span className="text-xs text-muted-foreground truncate">{username}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="shrink-0">
                        {loggedUser == postCreateId ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                                    <Ellipsis className="w-4 h-4" />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsOpen(true)} className="cursor-pointer">
                                        Update
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => mutate()} className="cursor-pointer text-destructive focus:text-destructive">
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <FollowButton targetUserId={post.user?._id || postCreateId} />
                        )}
                    </div>
                </header>

                {/* Content */}
                {isShare && body && (
                    <p className="text-sm text-foreground leading-relaxed">{body}</p>
                )}

                {!isShare && body && (
                    <p className="text-sm text-foreground leading-relaxed">{body}</p>
                )}

                {!isShare && postImage && (
                    <div className="rounded-xl overflow-hidden border border-border/60 bg-muted/30 max-h-87.5 flex items-center justify-center">
                        <img
                            src={postImage}
                            alt={body || "Post image"}
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}

                {isShare && sharedPost && (
                    <div className="border border-border/60 rounded-xl p-3 sm:p-4 bg-muted/20 space-y-3 mt-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-7 h-7">
                                <AvatarImage src={sharedPost.user?.photo} alt={sharedPost.user?.name} />
                                <AvatarFallback>{sharedPost.user?.name?.slice(0, 2).toLocaleUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold text-xs text-foreground">{sharedPost.user?.name}</span>
                                <span className="text-[10px] text-muted-foreground">
                                    {sharedPost.createdAt ? new Date(sharedPost.createdAt).toLocaleDateString() : ""}
                                </span>
                            </div>
                        </div>

                        {sharedPost.body && (
                            <p className="text-sm text-foreground/90 leading-relaxed">
                                {sharedPost.body}
                            </p>
                        )}

                        {(sharedPost?.image) && (
                            <div className="rounded-xl overflow-hidden border border-border/60 bg-muted/30 max-h-80 flex items-center justify-center">
                                <img
                                    src={sharedPost.image}
                                    alt="Shared post attachment"
                                    className="w-full h-full object-contain max-h-72"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Actions */}
                <footer className="flex items-center justify-between pt-2 border-t border-border/50 text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                            <LikeButton postId={post._id} likes={post.likes} />
                            <PostLikesModal postId={post._id} likesCount={post.likesCount} />
                        </div>
                        <Link to={`/comments/${postId}`}>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-primary hover:bg-primary/10 cursor-pointer">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs font-medium">{commentsCount}</span>
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-1">
                        <BookmarkButton
                            postId={post._id}
                            initialIsBookmarked={post.bookmarked ?? false}
                        />
                        <ShareButton
                            postId={post._id}
                            sharesCount={post.sharesCount}
                        />
                    </div>
                </footer>
            </div>
            {loggedUser == postCreateId && <UpdatePost isOpen={isOpen} setIsOpen={setIsOpen} post={post} />}
        </Container>
    );
}