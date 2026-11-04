import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import { getAllPosts } from "@/api/posts.api";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { AddPost } from "../components/AddPost";

export default function PostsPage() {
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
        <div>
            <AddPost/>
            {allPosts?.pages.map((page) =>
                page.data.posts.map((post) => (
                    <PostCard post={post} key={post._id} />
                ))
            )}
            
            <div className="h-20" ref={ref}>
                {isFetchingNextPage && <PostCardSkeleton />}
            </div>
        </div>
    );
}