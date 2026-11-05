import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFollowSuggestions, toggleFollowUser } from "@/api/user.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, UserCheck } from "lucide-react";
import { toast } from "sonner";

export default function FollowSuggestions() {
    const queryClient = useQueryClient();
    const [followedIds, setFollowedIds] = useState<string[]>([]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['follow-suggestions'],
        queryFn: getFollowSuggestions,
    });

    const suggestions = data?.data?.suggestions || [];

    const { mutate: handleFollow, isPending } = useMutation({
        mutationFn: (userId: string) => toggleFollowUser(userId),
        onSuccess: (_, userId) => {
            setFollowedIds(prev => 
                prev.includes(userId) 
                    ? prev.filter(id => id !== userId) 
                    : [...prev, userId]
            );
            queryClient.invalidateQueries({ queryKey: ['follow-suggestions'] });
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
            toast.success("Follow status updated successfully! ✨");
        },
        onError: () => {
            toast.error("Failed to update follow status");
        }
    });

    if (isLoading) {
        return (
            <div className="bg-card border border-border/60 rounded-xl p-6 flex justify-center items-center shadow-sm">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="bg-card border border-border/60 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-foreground tracking-tight">Who to follow</h3>
            
            <div className="divide-y divide-border/40">
                {suggestions.map((suggestion) => {
                    const isFollowed = followedIds.includes(suggestion._id);

                    return (
                        <div key={suggestion._id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <Avatar className="w-10 h-10 shrink-0 border border-border/50">
                                    <AvatarImage src={suggestion.photo} alt={suggestion.name} className="object-cover" />
                                    <AvatarFallback className="font-bold text-sm">
                                        {suggestion.name?.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-sm text-foreground truncate hover:underline cursor-pointer">
                                        {suggestion.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                        {suggestion.username}
                                    </span>
                                </div>
                            </div>

                            <Button 
                                variant={isFollowed ? "outline" : "default"}
                                size="sm"
                                disabled={isPending}
                                onClick={() => handleFollow(suggestion._id)}
                                className={`rounded-full px-4 text-xs font-medium gap-1.5 shrink-0 transition-all ${
                                    isFollowed 
                                        ? "border-border hover:bg-muted text-foreground" 
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                }`}
                            >
                                {isFollowed ? (
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
}