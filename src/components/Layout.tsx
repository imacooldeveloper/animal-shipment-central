
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNavigation from "./MobileNavigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

const SidebarToggleButton = () => {
  const { state, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  
  if (isMobile || state === "expanded") return null;
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="fixed top-4 left-4 z-30"
      onClick={toggleSidebar}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Open sidebar</span>
    </Button>
  );
};

const LayoutContent = () => {
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <SidebarToggleButton />
      <main className={cn(
        "flex-1 overflow-auto w-full",
        isMobile ? "pt-16 p-4" : "p-4 md:p-6"
      )}>
        <Outlet />
      </main>
      {isMobile && <MobileNavigation />}
    </div>
  );
};

const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default Layout;
