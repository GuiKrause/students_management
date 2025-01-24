import * as React from "react"
import { NavLink } from "react-router";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { UserRoundPlus, UsersRound } from "lucide-react"

// This is sample data.
const data = {
    navMain: [
        {
            title: "Alunos",
            url: "/home",
            icon: <UsersRound />
        },
        {
            title: "Cadastro",
            url: "/student",
            icon: <UserRoundPlus />
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <NavLink to={item.url} className="font-regular">
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}