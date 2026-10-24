import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { Toaster } from "sonner";
import AuthContextProvider from "./context/AuthContext/AuthContextProvider";

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <>
          <RouterProvider router={routes} />
          <Toaster richColors position="bottom-right" />
        </>
      </AuthContextProvider>
    </>
  );
}