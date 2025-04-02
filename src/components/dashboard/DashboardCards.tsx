
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Box, Users, Calendar, BrainCircuit, MessageSquare } from 'lucide-react';
import { Link } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  value: number;
  color: 'rose' | 'emerald' | 'blue' | 'purple' | 'amber';
  icon: React.ReactNode;
  path: string;
}

const DashboardCard = ({ title, value, color, icon, path }: DashboardCardProps) => {
  const bgColorClasses = {
    rose: 'bg-gradient-to-br from-rose-200 to-rose-300',
    emerald: 'bg-gradient-to-br from-emerald-200 to-emerald-300',
    blue: 'bg-gradient-to-br from-blue-200 to-blue-300',
    purple: 'bg-gradient-to-br from-purple-200 to-purple-300',
    amber: 'bg-gradient-to-br from-amber-200 to-amber-300',
  };
  
  const textColorClasses = {
    rose: 'text-rose-700',
    emerald: 'text-emerald-700',
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    amber: 'text-amber-700',
  };
  
  const textDarkColorClasses = {
    rose: 'text-rose-800',
    emerald: 'text-emerald-800',
    blue: 'text-blue-800',
    purple: 'text-purple-800',
    amber: 'text-amber-800',
  };
  
  return (
    <Link to={path} className="block">
      <Card className={`${bgColorClasses[color]} border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 rounded-xl p-3">
              {icon}
            </div>
          </div>
          <h2 className={`text-lg font-semibold ${textColorClasses[color]} mt-4`}>{title}</h2>
          <p className={`text-4xl font-bold ${textDarkColorClasses[color]} mt-1`}>{value}</p>
        </CardContent>
      </Card>
    </Link>
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <DashboardCard 
        title="Completed Shipments" 
        value={counts.complete} 
        color="rose" 
        icon={<Box className="h-6 w-6 text-rose-700" />} 
        path="/shipments"
      />
      <DashboardCard 
        title="Imports" 
        value={counts.draft} 
        color="emerald" 
        icon={<Users className="h-6 w-6 text-emerald-700" />} 
        path="/imports"
      />
      <DashboardCard 
        title="Exports" 
        value={counts.progress} 
        color="blue" 
        icon={<Calendar className="h-6 w-6 text-blue-700" />} 
        path="/exports"
      />
      <DashboardCard 
        title="Documents" 
        value={counts.complete} 
        color="purple" 
        icon={<BrainCircuit className="h-6 w-6 text-purple-700" />} 
        path="/documents"
      />
      <DashboardCard 
        title="Message Templates" 
        value={0} 
        color="amber" 
        icon={<MessageSquare className="h-6 w-6 text-amber-700" />} 
        path="/templates"
      />
    </div>
  );
};

export default DashboardCards;
