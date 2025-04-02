
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: number;
}

const DashboardCard = ({ title, value }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

interface DashboardCardsProps {
  counts: {
    total: number;
    draft: number;
    progress: number;
    complete: number;
  };
}

const DashboardCards = ({ counts }: DashboardCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard title="Total Shipments" value={counts.total} />
      <DashboardCard title="Draft" value={counts.draft} />
      <DashboardCard title="In Progress" value={counts.progress} />
      <DashboardCard title="Complete" value={counts.complete} />
    </div>
  );
};

export default DashboardCards;
