import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleLikePost } from "@/api/posts.api";
import { getUserProfile } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface LikeButtonProps {
    postId: string;
    initialLikesCount: number;
    likes: string[];
}

export default function LikeButton({ postId, initialLikesCount, likes }: LikeButtonProps) {
    const queryClient = useQueryClient();

    const { data: profileData } = useQuery({
        queryKey: ['my-profile'],
        queryFn: getUserProfile,
    });

    const currentUserId = profileData?.data?.user?._id;

    const isInitiallyLiked = currentUserId ? likes.includes(currentUserId) : false;

    const [isLikedLocal, setIsLikedLocal] = useState<boolean | null>(null);
    const [countLocal, setCountLocal] = useState<number | null>(null);

    const isLiked = isLikedLocal !== null ? isLikedLocal : isInitiallyLiked;
    const likesCount = countLocal !== null ? countLocal : initialLikesCount;

    const { mutate: handleLike, isPending } = useMutation({
        mutationFn: () => toggleLikePost(postId),
        onSuccess: (response) => {
            const serverLiked = response?.data?.liked;
            const serverCount = response?.data?.likesCount;

            const nextLiked = serverLiked !== undefined ? serverLiked : !isLiked;
            const nextCount = serverCount !== undefined ? serverCount : (nextLiked ? likesCount + 1 : likesCount - 1);

            setIsLikedLocal(nextLiked);
            setCountLocal(nextCount);

            queryClient.invalidateQueries({ queryKey: ['allPosts'] });
        },
        onError: () => {
            toast.error("Failed to update like status");
        }
    });

    return (
        <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => handleLike()}
            className={`gap-2 text-xs font-medium transition-colors ${
                isLiked 
                    ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
        >
            <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{likesCount}</span>
        </Button>
    );
}