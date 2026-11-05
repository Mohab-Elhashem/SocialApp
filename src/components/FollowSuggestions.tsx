import { useQuery } from "@tanstack/react-query";
import { getFollowSuggestions } from "@/api/user.api";
import { FollowButton } from "@/components/FollowButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

export default function FollowSuggestions() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['follow-suggestions'],
        queryFn: getFollowSuggestions,
    });

    const suggestions = data?.data?.suggestions || [];

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
                {suggestions.map((suggestion) => (
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

                        <FollowButton targetUserId={suggestion._id} />
                    </div>
                ))}
            </div>
        </div>
    );
}