import { useQueryClient } from "@tanstack/react-query"

export default function useUpdatePosts() {
        const queryClient = useQueryClient()
    return ()=>{
        queryClient.invalidateQueries({queryKey:['allPosts']})
    }
}
