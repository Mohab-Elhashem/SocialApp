import { createBrowserRouter } from "react-router-dom"
import LoginPage from "./features/auth/pages/LoginPage"
import RegisterPage from "./features/auth/pages/RegisterPage"
import PostsPage from "./features/posts/pages/PostsPage"
import AuthGard from "./gards/AuthGard"
import PostsGuard from "./gards/PostsGuard"
import ProfilePage from "./profile/pages/ProfilePage"
import MainLayout from "./layout/MainLayout"

const routes = createBrowserRouter([
    {
        path: '/', element: <MainLayout />, children: [
            { index: true, element: <AuthGard><LoginPage /></AuthGard> },
            { path: '/login', element: <AuthGard><LoginPage /></AuthGard> },
            { path: '/register', element: <AuthGard><RegisterPage /></AuthGard> },
            { path: '/posts', element: <PostsGuard><PostsPage /></PostsGuard> },
            { path: '/profile', element: <PostsGuard><ProfilePage /></PostsGuard> },
        ]
    }

])
export default routes