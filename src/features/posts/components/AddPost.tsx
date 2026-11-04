import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, PlusSquare } from "lucide-react";
import { useRef, useState } from "react";
import { Container } from "@/components/shared/Container";
import { createPost } from "@/api/posts.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useUpdatePosts from "@/hooks/useUpdatePosts";


export function AddPost() {
    const [open, setOpen] = useState(false);
    const [imgPrev, setImgPrev] = useState<null | string>(null);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);

    function handleAddPost() {
        const isBodyExist = textAreaRef.current?.value;
        const isImgExist = imgRef.current?.files?.[0];
        const formData = new FormData();

        if (isBodyExist) {
            formData.append('body', isBodyExist);
        }
        if (isImgExist) {
            formData.append('image', isImgExist);
        }
        if (!isBodyExist && !isImgExist) {
            return Promise.reject(new Error("Please write something or add an image"));
        }
        return createPost(formData);
    }

    const updatePosts = useUpdatePosts()
    const { mutate, isPending } = useMutation({
        mutationFn: handleAddPost,
        onSuccess: () => {
            updatePosts()
            toast.success("Post added successfully! 🎉");

            setOpen(false);
            if (textAreaRef.current) textAreaRef.current.value = "";
            if (imgRef.current) imgRef.current.value = "";
            if (imgPrev) {
                URL.revokeObjectURL(imgPrev);
                setImgPrev(null);
            }
        },
        onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        const errorMessage = error?.response?.data?.message || (err instanceof Error ? err.message : "Failed to add post");
        toast.error(errorMessage);
    }
    });

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        mutate();
    };


    return (
        <Container>
            <Dialog open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen && imgPrev) {
                    URL.revokeObjectURL(imgPrev);
                    setImgPrev(null);
                }
            }}>
                <DialogTrigger className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors cursor-pointer">
                    <span>Add Post</span>
                    <PlusSquare className="h-4 w-4" />
                </DialogTrigger>

                <DialogContent className="sm:max-w-131.25">
                    <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <Textarea
                            placeholder="What's on your mind?"
                            ref={textAreaRef}
                            rows={4}
                            className="resize-none"
                        />

                        <div>
                            <label className="mb-2 flex items-center gap-2 cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium w-fit transition-colors">
                                <Image className="w-4 h-4 text-primary" />
                                <span>Add Photo</span>
                                <input
                                    ref={imgRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (imgPrev) URL.revokeObjectURL(imgPrev);
                                            const imgUrl = URL.createObjectURL(file);
                                            setImgPrev(imgUrl);
                                        }
                                    }}
                                />
                            </label>
                            {imgPrev && (
                                <div className="relative mt-2 rounded-xl overflow-hidden border border-border/60 bg-muted/30">
                                    <img src={imgPrev} alt='image-preview' className="w-full max-h-75 object-contain" />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Posting..." : "Post"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </Container>
    );
}