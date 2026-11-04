import { useQueryClient } from "@tanstack/react-query"

export default function useUpdateComments(postId:string) {
        const queryClient = useQueryClient()
    return ()=>{
        queryClient.invalidateQueries({queryKey:['comments',postId]})
    }
}
