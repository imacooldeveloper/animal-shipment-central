
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto w-full">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
