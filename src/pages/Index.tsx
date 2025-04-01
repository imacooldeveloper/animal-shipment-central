
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowDownCircle, ArrowUpCircle, ClipboardList, FileText } from "lucide-react";

const Index = () => {
  const quickLinks = [
    {
      title: "Dashboard",
      description: "View shipment statistics and summaries",
      icon: <ClipboardList className="h-5 w-5" />,
      path: "/"
    },
    {
      title: "Import Shipments",
      description: "Manage incoming animal shipments",
      icon: <ArrowDownCircle className="h-5 w-5" />,
      path: "/imports"
    },
    {
      title: "Export Shipments",
      description: "Manage outgoing animal shipments",
      icon: <ArrowUpCircle className="h-5 w-5" />,
      path: "/exports"
    },
    {
      title: "Transfer Forms",
      description: "Access animal transfer documentation",
      icon: <FileText className="h-5 w-5" />,
      path: "/transfer-forms"
    }
  ];

  return (
    <div className="container mx-auto py-4 px-2 md:px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Welcome to Animal Shipment</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-app-blue-light p-2 rounded-md text-app-blue">
                      {link.icon}
                    </div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{link.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
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
