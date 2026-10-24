import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { getAllPosts, type Post } from "@/api/posts.api";
import PostCardSkeleton from "../components/PostCardSkeleton";

export default function PostsPage() {
    const [allPoasts, setAllPosts] = useState<Post[] | null>(null)
    useEffect(() => {
        getAllPosts().then((data) => setAllPosts(data.data.posts))
    }, [])

    return <>
        {allPoasts ? (allPoasts.map((post) => <PostCard key={post._id} post={post} />)) : <PostCardSkeleton />}

    </>
}
