import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/shared/Container";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, MessageSquare, Share2 } from "lucide-react";
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

export interface DecodedToken {
    user: string
    iat: number
    exp: number
    aud: string
    iss: string
}


export default function PostCard({ post }: { post: Post }) {
    
    const [isOpen, setIsOpen] = useState(false)
    const { user: { name, photo, username, _id: postCreateId }, body, id: postId, image: postImage, commentsCount, sharesCount } = post

    const { user: loggedUser } = jwtDecode<DecodedToken>(localStorage.getItem('token') || '');

    function handleDelete() {
        return deletePost(postId)
    }

    const updatePosts = useUpdatePosts()
    const { mutate } = useMutation({
        mutationFn: handleDelete,
        onSuccess: () => {
            updatePosts()
            toast.success("Post deleted successfully! 🎉");
        },
        onError: (err) => {
            console.log(err);

        }
    })

    return (
        <Container className="mx-auto py-3">
            <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 transition-all">

                {/* Header */}
                <header className="flex justify-between items-center gap-2">
                    {/* بيانات المستخدم مع منع التداخل باستخدام min-w-0 و truncate */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="w-10 h-10 shrink-0">
                            <AvatarImage src={photo} alt={name} />
                            <AvatarFallback>{post.user.name.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="font-semibold text-sm text-foreground truncate">{name}</span>
                                <span className="text-xs text-muted-foreground truncate">{username}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* زر المتابعة أو القائمة الجانبية مع منع انكماشه عبر shrink-0 */}
                    <div className="shrink-0">
                        {loggedUser == postCreateId ? (
                            <DropdownMenu>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Ellipsis className="w-4 h-4" />
                                </Button>
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
                <p className="text-sm text-foreground leading-relaxed">{body}</p>

                {/* Media Image */}
                {postImage && <div className="rounded-xl overflow-hidden border border-border/60 bg-muted/30 max-h-87.5 flex items-center justify-center">
                    <img
                        src={postImage}
                        alt={body}
                        className="w-full h-full object-contain"
                    />
                </div>}


                {/* Footer Actions */}
                <footer className="flex items-center justify-between pt-2 border-t border-border/50 text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <LikeButton
                            postId={post._id}
                            initialLikesCount={post.likesCount}
                            likes={post.likes}
                        />
                        <Link to={`/comments/${postId}`}>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-primary hover:bg-primary/10">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs font-medium">{commentsCount}</span>
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-1">
                        <BookmarkButton
                            postId={post._id}
                            initialBookmarksCount={post.bookmarksCount} // 👈 العداد (رقم)
                            initialIsBookmarked={post.bookmarked ?? false}   // 👈 الحالة (True أو False)
                        />
                        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-primary hover:bg-primary/10">
                            <Share2 className="w-4 h-4" />
                            <span className="text-xs font-medium">{sharesCount}</span>
                        </Button>
                    </div>
                </footer>
            </div>
            {loggedUser == postCreateId && <UpdatePost isOpen={isOpen} setIsOpen={setIsOpen} post={post} />}
        </Container>
    );
}