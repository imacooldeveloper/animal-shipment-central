
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarHeader, 
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  ClipboardList, 
  FileText, 
  FolderArchive, 
  MessageSquare,
  Menu,
  Import,
  Export
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();

  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: <ClipboardList className="h-5 w-5" />
    },
    {
      name: "Imports",
      path: "/imports",
      icon: <Import className="h-5 w-5" />
    },
    {
      name: "Exports",
      path: "/exports",
      icon: <Export className="h-5 w-5" />
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
        <div className="flex items-center gap-2 px-4">
          <span className="font-bold text-xl">Animal Shipment</span>
        </div>
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <nav className="space-y-1 p-2">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                location.pathname === route.path
                  ? "bg-app-blue-light text-app-blue font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {route.icon}
              <span>{route.name}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
