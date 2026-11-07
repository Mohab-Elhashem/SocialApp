import { useState, useRef } from "react";
import {
    Calendar,
    Heart,
    MessageCircle,
    Share2,
    Edit3,
    Camera,
    Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, getUserPosts, uploadProfilePhoto } from "@/api/user.api";
import { toast } from "sonner";
import type { Post } from "@/types/post.types";
import { Link } from "react-router-dom";
import PostLikesModal from "@/features/posts/components/PostLikesModal";
import LikeButton from "@/components/LikeButton";


export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"posts" | "media" | "bookmarks">("posts");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const { data: profileData, isLoading: isProfileLoading } = useQuery({
        queryKey: ['my-profile'],
        queryFn: getUserProfile,
    });

    const user = profileData?.data.user

    const { data: postsData, isLoading: isPostsLoading } = useQuery({
        queryKey: ['user-posts', user?._id],
        queryFn: () => getUserPosts(user!._id),
        enabled: !!user?._id,
    });

    const posts: Post[] = (postsData?.data.posts || []) as unknown as Post[];
    const { mutate: updatePhoto, isPending: isUploadingPhoto } = useMutation({
        mutationFn: (formData: FormData) => uploadProfilePhoto(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
            toast.success("Profile photo updated successfully! 📸");
        },
        onError: () => {
            toast.error("Failed to upload profile photo");
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('photo', file);
            updatePhoto(formData);
        }
    };

    if (isProfileLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-12">
            <div className="max-w-3xl mx-auto border-x border-border/60 bg-card shadow-sm min-h-screen">

                {/* Cover Photo */}
                <div className="h-48 md:h-64 w-full relative bg-muted overflow-hidden">
                    <img
                        src={user?.photo}
                        alt="Cover"
                        className="w-full object-contain"
                    />
                </div>

                {/* User Info & Actions Section */}
                <div className="px-4 sm:px-6 pb-4 border-b border-border/60 relative">
                    <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4">
                        <div className="relative group">
                            <Avatar className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-card rounded-full shadow-md bg-muted">
                                <AvatarImage src={user?.photo} alt={user?.name} className="object-cover" />
                                <AvatarFallback className="text-2xl font-bold">
                                    {user?.name?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingPhoto}
                                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                                title="Change profile photo"
                            >
                                {isUploadingPhoto ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button className="rounded-full px-5 font-medium gap-2 shadow-sm">
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>

                    {/* Name and Handle */}
                    <div className="space-y-1 mb-3">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{user?.name}</h1>
                        <p className="text-sm text-muted-foreground">{user?.username}</p>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="cursor-pointer hover:underline">
                            <span className="font-bold text-foreground">{user?.following?.length || 0}</span>{" "}
                            <span className="text-muted-foreground">Following</span>
                        </div>
                        <div className="cursor-pointer hover:underline">
                            <span className="font-bold text-foreground">{user?.followers?.length || 0}</span>{" "}
                            <span className="text-muted-foreground">Followers</span>
                        </div>
                        <div>
                            <span className="font-bold text-foreground">{posts.length}</span>{" "}
                            <span className="text-muted-foreground">Posts</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-border/60">
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`flex-1 py-3.5 text-sm font-semibold text-center transition-colors relative ${activeTab === "posts" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Posts
                        {activeTab === "posts" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("media")}
                        className={`flex-1 py-3.5 text-sm font-semibold text-center transition-colors relative ${activeTab === "media" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Media
                        {activeTab === "media" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("bookmarks")}
                        className={`flex-1 py-3.5 text-sm font-semibold text-center transition-colors relative ${activeTab === "bookmarks" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Bookmarks
                        {activeTab === "bookmarks" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                    </button>
                </div>

                {/* Tab Content / Feed */}
                <div className="divide-y divide-border/60">
                    {activeTab === "posts" && (
                        isPostsLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground text-sm">
                                No posts found.
                            </div>
                        ) : (
                            posts.map((post: Post) => (
                                <div key={post._id} className="p-4 sm:p-5 hover:bg-muted/20 transition-colors space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={post.user?.photo || user?.photo} alt={post.user?.name || user?.name} />
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-bold text-sm">{post.user?.name || user?.name}</h4>
                                                <span className="text-xs text-muted-foreground">{post.user?.username || user?.username}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm sm:text-base leading-relaxed pl-13">
                                        {post.body}
                                    </p>

                                    {post.image && (
                                        <div className="pl-13 pt-1">
                                            <div className="rounded-xl overflow-hidden border border-border/60 bg-muted/30 max-h-80 flex justify-center">
                                                <img src={post.image} alt="Post attachment" className="object-cover w-full h-full" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6 pt-2 pl-13 text-muted-foreground text-xs sm:text-sm">
                                        <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                                            <LikeButton postId={post._id} likes={post.likes} />
                                            <PostLikesModal
                                                postId={post._id}
                                                likesCount={post.likesCount || post.likes?.length || 0}
                                            />
                                        </div>
                                        <Link to={`/comments/${post._id}`}>
                                            <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{post.commentsCount || 0}</span>
                                            </button>
                                        </Link>
                                        <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    )}

                    {activeTab === "media" && (
                        <div className="grid grid-cols-3 gap-1 p-1">
                            {posts.filter((p: Post) => p.image).map((p: Post) => (
                                <div key={p._id} className="aspect-square bg-muted rounded-md overflow-hidden relative group cursor-pointer">
                                    <img src={p.image!} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "bookmarks" && (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                            Your bookmarks will appear here.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}