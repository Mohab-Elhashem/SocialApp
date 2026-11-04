import { Home, Search, Bell, MessageSquare, User, PlusSquare, LogOut, User2 } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/api/user.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const navItems = [
    { title: "Home", url: "/posts", icon: Home },
    { title: "Profile", url: "/profile", icon: User },
    { title: "Explore", url: "/explore", icon: Search },
    { title: "Notifications", url: "/notifications", icon: Bell },
    { title: "Messages", url: "/messages", icon: MessageSquare },
];

export function AppSidebar() {
    const navigate = useNavigate();
    const isLogin = localStorage.getItem('token')
    const { data } = useQuery({
        queryKey: ['user'],
        queryFn: getUserProfile,
    });

    return <>
        {isLogin && <Sidebar collapsible="icon">
            {/* 1. Header / Logo */}
            <SidebarHeader className="p-3 border-b border-sidebar-border">
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
                                            `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${isActive
                                                ? "bg-primary/15 text-primary font-semibold shadow-sm"
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
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <SidebarMenuButton className="flex justify-between">
                                <div className="flex gap-2 items-center">
                                    <Link to="/profile" className="flex items-center gap-2 group">
                                        <Avatar className="h-8 w-8 cursor-pointer">
                                            <AvatarImage src={data?.data.user.photo} alt={data?.data.user.name} />
                                            <AvatarFallback>
                                                <User2 className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <span>{data?.data.user.name}</span>
                                </div>
                                <LogOut
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        setTimeout(() => {
                                            toast.success("Logout successfully!");
                                            navigate('/');
                                        }, 1500);
                                    }}
                                    className="hover:text-red-500 hover:cursor-pointer"
                                />
                            </SidebarMenuButton>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>}
    </>

}