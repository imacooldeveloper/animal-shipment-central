
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarHeader, 
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  FileText, 
  FolderArchive, 
  MessageSquare,
  Menu,
  ArrowDownCircle,
  ArrowUpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

const Sidebar = () => {
  const location = useLocation();
  const { state, openMobile, setOpenMobile } = useSidebar();

  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: "Imports",
      path: "/imports",
      icon: <ArrowDownCircle className="h-5 w-5" />
    },
    {
      name: "Exports",
      path: "/exports",
      icon: <ArrowUpCircle className="h-5 w-5" />
    },
    {
      name: "Transfer Forms",
      path: "/transfer-forms",
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: "Documents",
      path: "/documents",
      icon: <FolderArchive className="h-5 w-5" />
    },
    {
      name: "Message Templates",
      path: "/templates",
      icon: <MessageSquare className="h-5 w-5" />
    }
  ];

  return (
    <SidebarComponent>
      <SidebarHeader className="flex justify-between items-center">
        <div className="flex items-center gap-2 px-4 overflow-hidden">
          <span className="font-bold text-xl text-rose-500">AnimalFlow</span>
        </div>
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <nav className="space-y-1 p-3">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                location.pathname === route.path
                  ? "bg-rose-50 text-rose-500 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => {
                // Close sidebar on mobile when a link is clicked
                if (openMobile) {
                  setOpenMobile(false);
                }
              }}
            >
              {route.icon}
              <span className="truncate">{route.name}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
