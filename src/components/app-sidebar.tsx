import { 
  Users, 
  ShoppingCart, 
  FileText, 
  CheckSquare, 
  History,
  Building2
} from "lucide-react"
import { NavLink } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Users,
    description: "Manage supplier information and evaluations"
  },
  {
    title: "Purchasing",
    url: "/purchasing",
    icon: ShoppingCart,
    description: "Create and approve purchase records"
  },
  {
    title: "Purchase Info",
    url: "/purchase-info",
    icon: FileText,
    description: "Manage specifications and requirements"
  },
  {
    title: "Verification",
    url: "/verification",
    icon: CheckSquare,
    description: "Plan and record verifications"
  },
  {
    title: "Audit Trail",
    url: "/audit",
    icon: History,
    description: "View system change logs"
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-primary">QMS</h1>
                <p className="text-xs text-muted-foreground">Quality Management</p>
              </div>
            )}
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <div className="flex-1">
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs opacity-75 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}