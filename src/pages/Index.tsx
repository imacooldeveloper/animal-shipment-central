
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCards from "@/components/dashboard/DashboardCards";

const Index = () => {
  // Sample counts for the dashboard cards
  const counts = {
    total: 15,
    draft: 3,
    progress: 8,
    complete: 0
  };

  return (
    <div className="container mx-auto py-4 px-2 md:px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Welcome to Animal Shipment</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Navigation Dashboard</h2>
        <DashboardCards counts={counts} />
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
