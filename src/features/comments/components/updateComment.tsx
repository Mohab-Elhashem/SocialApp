import { updateComment } from "@/api/comments.api"
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
import useUpdateComments from "@/hooks/useUpdateComments"
import type { Comment } from "@/types/comment.types"
import { useMutation } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { toast } from "sonner"

interface UpdateCommentProps {

    isOpen: boolean
    setIsOpen: (v: boolean) => void
    allComments: Comment
    postId:string
}

export function UpdateComment({ isOpen, setIsOpen, allComments,postId }: UpdateCommentProps) {
    const { image, content, _id:commetId } = allComments
    console.log(commetId);
    
    const [imgPrev, setImgPrev] = useState<string | null>(image || null)

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);

    function handleUpdatePost() {
        const BodyText = textAreaRef.current?.value;
        const ImgText = imgRef.current?.files?.[0];
        const formData = new FormData();

        if (BodyText) {
            formData.append('content', BodyText);
        }
        if (ImgText) {
            formData.append('image', ImgText);
        }
        if (!ImgText && !BodyText) {
            return Promise.reject(new Error("Please write something or add an image"));
        }
        return updateComment(postId,commetId,formData);

    }
    const updateComments = useUpdateComments(postId)
    const { mutate } = useMutation({
        mutationFn: handleUpdatePost,
        onSuccess: () => {
            updateComments()
            toast.success("Comment Updated successfully! 🎉");

            setIsOpen(false);
            if (textAreaRef.current) textAreaRef.current.value = "";
            if (imgRef.current) imgRef.current.value = "";
            if (imgPrev && imgPrev.startsWith('blob:')) {
                URL.revokeObjectURL(imgPrev);
            }
        },
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
                                defaultValue={content}
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
                                    <img src={imgPrev} alt={content || "post image"} className="object-contain max-h-48 rounded-md" />
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