import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sharePost } from "@/api/posts.api";
import { Button } from "@/components/ui/button";
import { Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ShareButtonProps {
    postId: string;
    sharesCount?: number;
}

export default function ShareButton({ postId, sharesCount = 0 }: ShareButtonProps) {
    const queryClient = useQueryClient();
    const [optimisticDelta, setOptimisticDelta] = useState(0);

    const displayCount = sharesCount + optimisticDelta;

    const { mutate: handleShare, isPending: isSharing } = useMutation({
        mutationFn: () => sharePost(postId),
        
        onMutate: () => {
            setOptimisticDelta((prev) => prev + 1);
        },
        
        onSuccess: () => {
            toast.success("Post shared successfully! 🚀");
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        
        onError: (error) => {
            const status = error.message            
            if (status === 'Request failed with status code 409') {
                toast.info("You have already shared this post!");
            }
        },
        
        onSettled: () => {
            setOptimisticDelta(0);
        }
    });

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleShare()}
            disabled={isSharing}
            className="flex items-center gap-1.5 hover:text-primary hover:bg-primary/10 cursor-pointer"
        >
            {isSharing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Share2 className="w-4 h-4" />
            )}
            
            <span className="text-xs font-medium">{displayCount}</span>
        </Button>
    );
}