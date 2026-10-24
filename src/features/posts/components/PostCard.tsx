import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/shared/Container";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import type { Post } from "@/api/posts.api";

export default function PostCard({ post }: { post: Post }) {
    const { user: { name, photo, username }, body, image: postImage, likesCount, commentsCount, sharesCount, bookmarked } = post

    return (
        <Container className="max-w-xl mx-auto py-2">
            <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 transition-all">

                {/* Header */}
                <header className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={photo} alt={name} />
                            <AvatarFallback>{post.user.name.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-foreground">{name}</span>
                                <span className="text-xs text-muted-foreground">{username}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Ellipsis className="w-4 h-4" />
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Content */}
                <p className="text-sm text-foreground leading-relaxed">{body}</p>

                {/* Media Image */}
                {postImage && <div className="rounded-xl overflow-hidden border border-border/60 bg-muted/30 max-h-87.5">
                    <img
                        src={postImage}
                        alt={body}
                        className="w-full h-full object-cover"
                    />
                </div>}


                {/* Footer Actions */}
                <footer className="flex items-center justify-between pt-2 border-t border-border/50 text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-red-500 hover:bg-red-500/10">
                            <Heart className="w-4 h-4" />
                            <span className="text-xs font-medium">{likesCount}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-primary hover:bg-primary/10">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs font-medium">{commentsCount}</span>
                        </Button>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 transition-colors ${bookmarked ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                                }`}
                        >
                            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-primary hover:bg-primary/10">
                            <Share2 className="w-4 h-4" />
                            <span className="text-xs font-medium">{sharesCount}</span>
                        </Button>
                    </div>
                </footer>
            </div>
        </Container>
    );
}