import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleLikePost } from "@/api/posts.api";
import { getUserProfile } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface LikeButtonProps {
    postId: string;
    likes: string[];
}

export default function LikeButton({ postId, likes }: LikeButtonProps) {
    const queryClient = useQueryClient();

    const { data: profileData } = useQuery({
        queryKey: ['my-profile'],
        queryFn: getUserProfile,
    });

    const currentUserId = profileData?.data?.user?._id;
    const isInitiallyLiked = currentUserId ? likes.includes(currentUserId) : false;

    const [isLikedLocal, setIsLikedLocal] = useState<boolean | null>(null);
    const isLiked = isLikedLocal !== null ? isLikedLocal : isInitiallyLiked;

    const { mutate: handleLike, isPending } = useMutation({
        mutationFn: () => toggleLikePost(postId),
        onSuccess: (response) => {
            const serverLiked = response?.data?.liked;
            const nextLiked = serverLiked !== undefined ? serverLiked : !isLiked;

            setIsLikedLocal(nextLiked);
            queryClient.invalidateQueries({ queryKey: ['allPosts'] });
            queryClient.invalidateQueries({ queryKey: ['post-likes', postId] });
        },
        onError: () => {
            toast.error("Failed to update like status");
        }
    });

    return (
        <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={() => handleLike()}
            className={`h-8 w-8 transition-colors ${
                isLiked 
                    ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
        >
            <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
    );
}