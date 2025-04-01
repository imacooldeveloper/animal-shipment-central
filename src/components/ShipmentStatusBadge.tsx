
import { ShipmentStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
  className?: string;
}

const statusLabels: Record<ShipmentStatus, string> = {
  draft: 'Draft',
  progress: 'In Progress',
  complete: 'Complete'
};

const statusColors: Record<ShipmentStatus, string> = {
  draft: 'bg-app-status-draft/20 text-app-status-draft border-app-status-draft/50',
  progress: 'bg-app-status-progress/20 text-app-status-progress border-app-status-progress/50',
  complete: 'bg-app-status-complete/20 text-app-status-complete border-app-status-complete/50'
};

const ShipmentStatusBadge = ({ status, className }: ShipmentStatusBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(statusColors[status], className)}
    >
      {statusLabels[status]}
    </Badge>
  );
};

export default ShipmentStatusBadge;
