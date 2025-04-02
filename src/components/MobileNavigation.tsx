
import { Link, useLocation } from "react-router-dom";
import { 
  ClipboardList, 
  FileText, 
  FolderArchive, 
  MessageSquare,
  ArrowDownCircle,
  ArrowUpCircle,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger
} from "@/components/ui/drawer";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

const MobileNavigation = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { openMobile, setOpenMobile } = useSidebar();
  
  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: <ClipboardList className="h-5 w-5" />
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
      name: "Templates",
      path: "/templates",
      icon: <MessageSquare className="h-5 w-5" />
    }
  ];

  const handleOpenSidebar = () => {
    setOpenMobile(true);
  };

  return (
    <>
      {/* Fixed top navigation bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-background border-b border-border md:hidden z-20">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center">
            <button 
              onClick={handleOpenSidebar}
              className="flex items-center justify-center rounded-md p-2 hover:bg-accent mr-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </button>
            
            <span className="font-bold text-lg truncate max-w-[120px]">Animal Shipment</span>
          </div>
          
          <div className="flex items-center">
            {routes.slice(0, 4).map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "flex items-center justify-center rounded-md p-2 hover:bg-accent",
                  location.pathname === route.path ? "text-app-blue" : "text-muted-foreground"
                )}
              >
                {route.icon}
                <span className="sr-only">{route.name}</span>
              </Link>
            ))}
            
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <button className="flex items-center justify-center rounded-md p-2 hover:bg-accent text-muted-foreground">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">More</span>
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-medium">Navigation</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {routes.map((route) => (
                      <Link
                        key={route.path}
                        to={route.path}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-md py-3 hover:bg-accent",
                          location.pathname === route.path ? "text-app-blue bg-app-blue-light" : "text-muted-foreground"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {route.icon}
                        <span className="mt-1 text-xs">{route.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
