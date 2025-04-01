
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNavigation from "./MobileNavigation";
import { cn } from "@/lib/utils";

const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className={cn(
          "flex-1 overflow-auto w-full",
          isMobile ? "pt-16 p-4" : "p-4 md:p-6"
        )}>
          <Outlet />
        </main>
        {isMobile && <MobileNavigation />}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
