import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { Toaster } from "sonner";
import AuthContextProvider from "./context/AuthContext/AuthContextProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,   
    },
  },
});

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <>
            <RouterProvider router={routes} />
            <Toaster richColors position="bottom-right" />
          </>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}