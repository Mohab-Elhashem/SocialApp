import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Languages, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function MainLayout() {
    const isLogin = localStorage.getItem('token');
    const { toggleTheme } = useTheme();

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-slate-50 dark:bg-slate-900">
                <header className="flex h-15 items-center gap-4 border-b bg-white dark:bg-slate-800 px-4 sticky top-0 z-10 shadow-sm">
                    {isLogin && <SidebarTrigger />}
                    <h1 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                        Social App
                    </h1>
                    <div className="ms-auto flex items-center gap-1">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            <Sun className="w-5 h-5 hidden dark:block text-yellow-400" />
                            <Moon className="w-5 h-5 block dark:hidden text-slate-700" />
                        </button>
                        <button
                            type="button"
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Change Language"
                        >
                            <Languages className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Main Content Area with Right Sidebar */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto flex gap-6 ">
                        <div className="flex-1 min-w-0 ">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}