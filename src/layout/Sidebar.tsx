import { Home, Search, Bell, MessageSquare, User, PlusSquare, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const navItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Explore", url: "/explore", icon: Search },
    { title: "Notifications", url: "/notifications", icon: Bell },
    { title: "Messages", url: "/messages", icon: MessageSquare },
    { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
    const navigate = useNavigate();

    return (
        <Sidebar collapsible="icon">
            {/* 1. Header / Logo */}
            <SidebarHeader className="p-4 border-b border-sidebar-border">
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                        S
                    </div>
                    <span className="font-bold text-lg group-data-[collapsible=icon]:hidden truncate">
                        SocialApp
                    </span>
                </div>
            </SidebarHeader>

            {/* 2. Navigation Content */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <NavLink
                                        to={item.url}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
                                                isActive
                                                    ? "bg-primary/15 text-primary font-semibold shadow-sm" // 👈 خلفية مميزة للصفحة الحالية
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            }`
                                        }
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        <span className="group-data-[collapsible=icon]:hidden truncate">
                                            {item.title}
                                        </span>
                                    </NavLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className="p-3 group-data-[collapsible=icon]:hidden">
                    <Button className="w-full gap-2 shadow-sm">
                        <span>Add Post</span>
                        <PlusSquare className="h-4 w-4" />
                    </Button>
                </div>
            </SidebarContent>

            {/* 3. User Profile / Footer */}
            <SidebarFooter className="border-t border-sidebar-border p-3">
                {/* 👈 أضفنا group-data-[collapsible=icon]:justify-center و group-data-[collapsible=icon]:gap-0 لمنع خروج الأفاتار وثباته في المنتصف */}
                <div className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:gap-0">
                    <div className="flex items-center gap-3 min-w-0 group-data-[collapsible=icon]:gap-0">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage />
                            <AvatarFallback>user</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left truncate group-data-[collapsible=icon]:hidden">
                            <span className="text-sm font-semibold leading-none truncate">
                                name
                            </span>
                            <span className="text-xs text-muted-foreground truncate mt-1">
                                @username
                            </span>
                        </div>
                    </div>
                    <LogOut
                        onClick={(e) => {
                            e.stopPropagation();
                            localStorage.removeItem('token');
                            setTimeout(() => {
                                toast.success("Logout successfully!");
                                navigate('/');
                            }, 1500);
                        }}
                        className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden hover:text-destructive transition-colors shrink-0 cursor-pointer"
                    />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}