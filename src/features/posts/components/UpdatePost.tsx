import { updatePost } from "@/api/posts.api"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import useUpdatePosts from "@/hooks/useUpdatePosts"
import type { Post } from "@/types/post.types"
import { useMutation } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { toast } from "sonner"

interface DialogProps {
    isOpen: boolean
    setIsOpen: (v: boolean) => void
    post: Post
}

export function UpdatePost({ isOpen, setIsOpen, post }: DialogProps) {
    const { image, body, _id: postId } = post
    const [imgPrev, setImgPrev] = useState<string | null>(image || null)

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);

    function handleUpdatePost() {
        const BodyText = textAreaRef.current?.value;
        const ImgText = imgRef.current?.files?.[0];
        const formData = new FormData();

        if (BodyText) {
            formData.append('body', BodyText);
        }
        if (ImgText) {
            formData.append('image', ImgText);
        }
        if (!ImgText && !BodyText) {
            return Promise.reject(new Error("Please write something or add an image"));
        }
        return updatePost(postId, formData);

    }
    const updatePosts = useUpdatePosts()
    const { mutate } = useMutation({
        mutationFn: handleUpdatePost,
        onSuccess: () => {
            updatePosts()
            toast.success("Post Updated successfully! 🎉");

            setIsOpen(false);
            if (textAreaRef.current) textAreaRef.current.value = "";
            if (imgRef.current) imgRef.current.value = "";
            if (imgPrev && imgPrev.startsWith('blob:')) {
                URL.revokeObjectURL(imgPrev);
            }
        },
        onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = error?.response?.data?.message || (err instanceof Error ? err.message : "Failed to add post");
            toast.error(errorMessage);
        }
    });


    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                setImgPrev(image ?? null);
            }
        }}>
            <form>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="space-y-4">
                        <Field>
                            <Label htmlFor="body">Body: </Label>
                            <Textarea
                                ref={textAreaRef}
                                id="body"
                                name="body"
                                defaultValue={body}
                                className="mt-1 resize-none"
                                rows={4}
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="image-upload" className="block mb-2 cursor-pointer text-sm font-medium text-primary hover:underline">
                                Image:
                            </Label>
                            <input
                                id="image-upload"
                                type="file"
                                ref={imgRef}
                                accept="image/*"
                                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer mb-3"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (imgPrev && imgPrev.startsWith('blob:')) {
                                            URL.revokeObjectURL(imgPrev);
                                        }
                                        const imgUrl = URL.createObjectURL(file);
                                        setImgPrev(imgUrl);
                                    }
                                }}
                            />
                            {imgPrev && (
                                <div className="relative rounded-xl overflow-hidden border border-border/60 bg-muted/30 max-h-55 flex justify-center p-2">
                                    <img src={imgPrev} alt={body || "post image"} className="object-contain max-h-48 rounded-md" />
                                </div>
                            )}
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button type="button" onClick={() => mutate()}  >
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
