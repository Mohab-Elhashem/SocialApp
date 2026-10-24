import { Container } from "@/components/shared/Container";

export default function PostCardSkeleton() {
    return <>
        {Array.from({ length: 3 }).map((_,index) => <Container className="max-w-xl mx-auto py-2" key={index}>
            <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 animate-pulse">

                {/* Header Skeleton */}
                <header className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {/* Avatar Skeleton */}
                        <div className="w-10 h-10 rounded-full bg-muted" />

                        {/* Name & Details Skeleton */}
                        <div className="flex flex-col space-y-1.5">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-28 bg-muted rounded-md" />
                                <div className="h-3 w-16 bg-muted rounded-md" />
                            </div>
                            <div className="h-3 w-20 bg-muted rounded-md" />
                        </div>
                    </div>

                    {/* Options Button Skeleton */}
                    <div className="h-8 w-8 rounded-md bg-muted" />
                </header>

                {/* Content Text Skeletons */}
                <div className="space-y-2 pt-1">
                    <div className="h-4 w-full bg-muted rounded-md" />
                    <div className="h-4 w-3/4 bg-muted rounded-md" />
                </div>

                {/* Media Image Skeleton */}
                <div className="rounded-xl overflow-hidden bg-muted h-64 sm:h-80 w-full" />

                {/* Footer Actions Skeleton */}
                <footer className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-14 bg-muted rounded-md" />
                        <div className="h-8 w-14 bg-muted rounded-md" />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-muted rounded-md" />
                        <div className="h-8 w-14 bg-muted rounded-md" />
                    </div>
                </footer>
            </div>
        </Container>)}

    </>


}