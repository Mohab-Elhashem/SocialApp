import { createComment } from "@/api/comments.api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Image as ImageIcon, X } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

export default function CreateComment({ postId }: { postId: string }) {
    const [imgPrev, setImgPrev] = useState<string | null>(null)
    const imgRef = useRef<HTMLInputElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: (formData: FormData) => createComment(postId, formData),
        onSuccess: () => {
            toast.success("Comment added successfully!")
            queryClient.invalidateQueries({ queryKey: ['comments', postId] })
            if (textAreaRef.current) textAreaRef.current.value = ""
            setImgPrev(null)
            if (imgRef.current) imgRef.current.value = ""
        },
    })

    function handleCreateComment() {
        const content = textAreaRef.current?.value
        const file = imgRef.current?.files?.[0]

        if (!content && !file) {
            toast.error("Please write a comment or add an image")
            return
        }

        const formData = new FormData()
        if (content) {
            formData.append('content', content)
        }
        if (file) {
            formData.append('image', file)
        }

        mutate(formData)
    }


    return (
        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm space-y-3">
            <div className="flex gap-3 items-start">
                <div className="flex-1 space-y-3">
                    <Textarea
                        ref={textAreaRef}
                        placeholder="Write a comment..."
                        className="resize-none min-h-20 bg-background/50"
                    />

                    {imgPrev && (
                        <div className="relative rounded-xl overflow-hidden border border-border/60 bg-muted/30 max-h-52 flex justify-center p-2">
                            <img src={imgPrev} alt="Comment attachment preview" className="object-contain max-h-48 rounded-md" />

                            <button
                                type="button"
                                onClick={() => {
                                    if (imgPrev.startsWith('blob:')) {
                                        URL.revokeObjectURL(imgPrev);
                                    }
                                    setImgPrev(null);
                                    if (imgRef.current) imgRef.current.value = "";
                                }}
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow hover:bg-destructive/90 transition-colors cursor-pointer"
                                title="Remove image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                        <div>
                            <input
                                type="file"
                                ref={imgRef}
                                accept="image/*"
                                className="hidden"
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
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary gap-1.5 h-8 px-2 cursor-pointer"
                                onClick={() => imgRef.current?.click()}
                            >
                                <ImageIcon className="w-4 h-4" />
                                <span className="text-xs">Add Image</span>
                            </Button>
                        </div>

                        <Button size="sm" onClick={handleCreateComment} disabled={isPending}>
                            {isPending ? "Posting..." : "Post Comment"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}