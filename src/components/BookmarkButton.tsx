import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBookmarkPost } from "@/api/posts.api";
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BookmarkButtonProps {
    postId: string;
    initialBookmarksCount?: number;
    initialIsBookmarked?: boolean; // 👈 أضفناها لتحديد هل البوست محفوظ مسبقاً أم لا
}

export function BookmarkButton({ 
    postId, 
    initialBookmarksCount = 0, 
    initialIsBookmarked = false 
}: BookmarkButtonProps) {
    const queryClient = useQueryClient();

    // حالات محلية لتحديث الواجهة فورياً عند الضغط (Instant UI Feedback)
    const [isBookmarkedLocal, setIsBookmarkedLocal] = useState<boolean | null>(null);
    const [countLocal, setCountLocal] = useState<number | null>(null);

    // ✅ التصحيح هنا: استخدام boolean للحالة و number للعدادات بشكل سليم
    const isBookmarked = isBookmarkedLocal !== null ? isBookmarkedLocal : initialIsBookmarked;
    const bookmarksCount = countLocal !== null ? countLocal : initialBookmarksCount;

    // استخدام useMutation لإرسال طلب الـ Bookmark / Unbookmark
    const { mutate: handleBookmark, isPending } = useMutation({
        mutationFn: () => toggleBookmarkPost(postId),
        onSuccess: (response) => {
            const serverBookmarked = response?.data?.bookmarked;
            const serverCount = response?.data?.bookmarksCount;

            const nextBookmarked = serverBookmarked !== undefined ? serverBookmarked : !isBookmarked;
            const nextCount = serverCount !== undefined ? serverCount : (nextBookmarked ? bookmarksCount + 1 : bookmarksCount - 1);

            setIsBookmarkedLocal(nextBookmarked);
            setCountLocal(nextCount);

            // تحديث الكاش لتظل البيانات مزامنة في كل التطبيق والبروفايل
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['user-posts'] });
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });

            toast.success(nextBookmarked ? "Post bookmarked successfully! 🔖" : "Post removed from bookmarks");
        },
        onError: () => {
            toast.error("Failed to update bookmark status");
        }
    });

    return (
        <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => handleBookmark()}
            className={`gap-2 text-xs font-medium transition-colors ${
                isBookmarked
                    ? "text-primary hover:text-primary/80 hover:bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Bookmark className={`w-4 h-4 transition-transform active:scale-125 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
            )}
            <span>{bookmarksCount}</span>
        </Button>
    );
}