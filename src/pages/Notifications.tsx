import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Heart, MessageSquare, Share2, User2, Loader2, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { getNotifications, markAllAsRead, markAsRead } from "@/api/notifications.api";

export default function NotificationsPage() {
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["notifications"],
        queryFn: ({ pageParam = 1 }) => getNotifications(pageParam, 10),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage?.meta?.pagination?.nextPage ?? undefined;
        },
    });

    const notifications = data?.pages.flatMap((page) => page?.data?.notifications || []) || [];

    const { mutate: markSingle } = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
        },
    });

    const { mutate: markAll, isPending: isMarkingAll } = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            toast.success("All notifications marked as read");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
        },
    });

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "like_post":
                return <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />;
            case "comment_post":
                return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case "share_post":
                return <Share2 className="h-4 w-4 text-emerald-500" />;
            default:
                return <Bell className="h-4 w-4 text-primary" />;
        }
    };

    const getNotificationText = (type: string) => {
        switch (type) {
            case "like_post":
                return "liked your post.";
            case "comment_post":
                return "commented on your post.";
            case "share_post":
                return "shared your post.";
            default:
                return "interacted with your content.";
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
                </div>

                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => markAll()} 
                    disabled={isMarkingAll}
                    className="gap-2"
                >
                    <CheckCheck className="h-4 w-4" />
                    Mark all as read
                </Button>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : notifications.length > 0 ? (
                    <>
                        {notifications.map((notif) => (
                            <div
                                key={notif._id}
                                onClick={() => {
                                    if (!notif.isRead) markSingle(notif._id);
                                }}
                                className={`flex items-start gap-4 p-4 bg-card border rounded-xl shadow-sm transition-all cursor-pointer hover:border-primary/50 ${
                                    notif.isRead ? "border-border/60 opacity-80" : "border-primary/40 bg-primary/5 font-medium"
                                }`}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={notif.actor?.photo} alt={notif.actor?.name} />
                                        <AvatarFallback>
                                            <User2 className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full border shadow-sm">
                                        {getNotificationIcon(notif.type)}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-1">
                                    <p className="text-sm text-foreground">
                                        <span className="font-semibold">{notif.actor?.name}</span>{" "}
                                        <span className="text-muted-foreground">{getNotificationText(notif.type)}</span>
                                    </p>
                                    <span className="text-xs text-muted-foreground block">
                                        {new Date(notif.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>

                                {!notif.isRead && (
                                    <span className="h-2.5 w-2.5 rounded-full bg-primary self-center" />
                                )}
                            </div>
                        ))}

                        {hasNextPage && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="w-full"
                                >
                                    {isFetchingNextPage ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Loading more...
                                        </>
                                    ) : (
                                        "Load More"
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        No notifications found.
                    </div>
                )}
            </div>
        </div>
    );
}