import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostLikes } from "@/api/posts.api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import type { LikedUser } from "@/types/post.types";

interface PostLikesModalProps {
    postId: string;
    likesCount: number;
}

export default function PostLikesModal({ postId, likesCount }: PostLikesModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['post-likes', postId],
        queryFn: ({ pageParam = 1 }) => getPostLikes(postId, pageParam, 10),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, numberOfPages } = lastPage.meta.pagination;
            return currentPage < numberOfPages ? currentPage + 1 : undefined;
        },
        enabled: isOpen,
    });

    const likedUsers: LikedUser[] = data?.pages.flatMap((page) => page.data.likes) || [];
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer group bg-transparent border-none p-0"
            >
                <span className="group-hover:underline">{likesCount}</span>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>People who liked this post</DialogTitle>
                </DialogHeader>

                <div className="max-h-80 overflow-y-auto space-y-3 py-2 pr-1">
                    {isLoading ? (
                        <div className="flex justify-center py-6">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : likedUsers.length > 0 ? (
                        <>
                            {/* عرض قائمة المستخدمين */}
                            {likedUsers.map((user) => (
                                <div key={user._id} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9">
                                            <AvatarImage src={user.photo} alt={user.name} />
                                            <AvatarFallback>{user.name?.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm text-foreground">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">@{user.username}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* زر Load More لجلب الصفحة التالية إذا كانت موجودة */}
                            {hasNextPage && (
                                <div className="flex justify-center pt-3 pb-1">
                                    <button
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        className="text-xs text-primary font-medium hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                    >
                                        {isFetchingNextPage ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                Loading more...
                                            </>
                                        ) : (
                                            "Load more"
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-6">No likes yet.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}