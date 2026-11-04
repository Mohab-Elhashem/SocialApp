import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleFollowUser, getUserProfile } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FollowButtonProps {
    targetUserId: string;
}

// تعريف نوع العنصر بدقة
type FollowingItem = string | { _id?: string };

export function FollowButton({ targetUserId }: FollowButtonProps) {
    const queryClient = useQueryClient();

    // 1️⃣ جلب بيانات المستخدم الحالي
    const { data: profileData } = useQuery({
        queryKey: ['my-profile'],
        queryFn: getUserProfile,
    });

    const currentUser = profileData?.data?.user;

    const { mutate: handleFollow, isPending } = useMutation({
        mutationFn: () => toggleFollowUser(targetUserId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
            queryClient.invalidateQueries({ queryKey: ['follow-suggestions'] });
            queryClient.invalidateQueries({ queryKey: ['user-posts'] });
            toast.success("Follow status updated successfully! ✨");
        },
        onError: () => {
            toast.error("Failed to update follow status");
        }
    });

    if (currentUser?._id === targetUserId) {
        return null;
    }

    // 2️⃣ عمل Type Casting بأمان تام لحل مشكلة unknown[]
    const followingList: FollowingItem[] = (currentUser?.following || []) as FollowingItem[];
    
    const isFollowing = followingList.some((item: FollowingItem) => 
        typeof item === 'string' ? item === targetUserId : item?._id === targetUserId
    );

    return (
        <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            disabled={isPending}
            onClick={() => handleFollow()}
            className={`rounded-full px-3.5 h-8 text-xs font-medium gap-1.5 transition-all shrink-0 ${
                isFollowing 
                    ? "border-border hover:bg-muted text-foreground" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
        >
            {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserCheck className="w-3.5 h-3.5 text-primary" />
                    <span>Following</span>
                </>
            ) : (
                <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                </>
            )}
        </Button>
    );
}