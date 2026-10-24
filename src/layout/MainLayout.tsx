import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-slate-50 dark:bg-slate-900">
                <header className="flex h-14 items-center gap-4 border-b bg-white dark:bg-slate-800 px-4 sticky top-0 z-10">
                    <SidebarTrigger />
                    <h1 className="font-semibold text-lg">Social App</h1>
                </header>

                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}