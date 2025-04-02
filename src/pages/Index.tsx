
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCards from "@/components/dashboard/DashboardCards";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, FileText, Truck, Ship } from "lucide-react";

const Index = () => {
  // Sample counts for the dashboard cards, now including imports and exports
  const counts = {
    total: 15,
    draft: 3,
    progress: 8,
    complete: 4,
    imports: 5,
    exports: 10
  };

  return (
    <div className="container mx-auto py-4 px-2 md:px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Welcome to Animal Shipment</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Navigation Dashboard</h2>
        <DashboardCards counts={counts} />
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">All Shipments</CardTitle>
              <CardDescription>Access all import and export shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-rose-500 hover:bg-rose-600">
                <Link to="/shipments">
                  <Package className="mr-2 h-4 w-4" />
                  Go to Shipments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Import Shipments</CardTitle>
              <CardDescription>Manage incoming animal shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/imports">
                  <Ship className="mr-2 h-4 w-4" />
                  Go to Imports
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Export Shipments</CardTitle>
              <CardDescription>Manage outgoing animal shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/exports">
                  <Truck className="mr-2 h-4 w-4" />
                  Go to Exports
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">
              Your recent shipment activities will appear here.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
