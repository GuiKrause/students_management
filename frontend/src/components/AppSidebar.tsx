import * as React from "react"
import { NavLink } from "react-router";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { LogOut, UserRoundPlus, UsersRound } from "lucide-react"
import { useAuth } from "@/contexts/AuthProvider";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { handleLogout } = useAuth()

    return (
        <Sidebar {...props}>
            <SidebarHeader className="mb-8">
                <SidebarMenu >
                    <SidebarMenuItem >
                        <SidebarMenuButton size="lg" className="h-16 flex justify-center" asChild>
                            <a href="#" >
                                <div className="flex flex-col items-center">
                                    <span className="font-semibold text-3xl">CODETECH</span>
                                    <span className="font-thin">desenvolvimento de sistemas</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <NavLink to={"/home"} className="font-regular flex items-center gap-2">
                            <SidebarMenuItem key={"students"} className="cursor-pointer w-full">
                                <SidebarMenuButton asChild>
                                    <div>
                                        <UsersRound size={18} />
                                        <span className="text-md">Alunos</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </NavLink>
                        <NavLink to={"/student"} className="font-regular flex items-center gap-2">
                            <SidebarMenuItem key={"create-student"} className="cursor-pointer w-full">
                                <SidebarMenuButton asChild>
                                    <div>
                                        <UserRoundPlus size={18} />
                                        <span className="text-md">Cadastro</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </NavLink>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="items-center text-center">
                <SidebarMenuItem key={"create-student"} className="cursor-pointer w-full" onClick={() => {
                    handleLogout();
                    window.location.reload();
                }}>
                    <SidebarMenuButton asChild>
                        <div>
                            <LogOut size={18} />
                            <span className="text-md">Sair</span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}