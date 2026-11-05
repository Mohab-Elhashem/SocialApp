import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import { getAllPosts } from "@/api/posts.api";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { AddPost } from "../components/AddPost";
import FollowSuggestions from "@/components/FollowSuggestions";

export default function PostsPage() {
    const isLogin = localStorage.getItem('token');

    const {
        data: allPosts,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['allPosts'],
        queryFn: ({ pageParam }) => getAllPosts(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastResponse) => {
            const { currentPage, nextPage, numberOfPages } = lastResponse.meta.pagination;
            if (currentPage >= numberOfPages) {
                return undefined;
            }
            return nextPage;
        }
    });

    const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-center gap-6">

            <div className="w-full max-w-xl space-y-4 flex-1">
                <AddPost />

                {allPosts?.pages.map((page) =>
                    page.data.posts.map((post) => (
                        <PostCard post={post} key={post._id} />
                    ))
                )}

                <div className="h-20" ref={ref}>
                    {isFetchingNextPage && <PostCardSkeleton />}
                </div>
            </div>

            <aside className="hidden lg:block w-80 shrink-0 space-y-4 sticky top-6 self-start">
                {isLogin && <FollowSuggestions />}
            </aside>

        </div>
    );
}