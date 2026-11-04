import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import PostCardSkeleton from "../../posts/components/PostCardSkeleton"
import PostCard from "../../posts/components/PostCard"
import { getSinglePost } from "@/api/posts.api"
import { Comments } from "../components/comment"
import { Container } from "@/components/shared/Container"

export default function CommentsPage() {
    const { id: postId } = useParams<{ id: string }>()

    const { isLoading, data: singlePostResponse } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getSinglePost(postId!),
        enabled: !!postId,
    })
    if (isLoading) {
        return <PostCardSkeleton />
    }


    return <>
        {singlePostResponse && <PostCard post={singlePostResponse.data.post} />}
        <Container>
            {postId && <Comments postId={postId}/>}
        </Container>
    </>
}
