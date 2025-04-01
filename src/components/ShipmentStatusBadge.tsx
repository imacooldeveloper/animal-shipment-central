
import { ShipmentStatus } from '@/types';
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

const ShipmentStatusBadge = ({ status, className }: ShipmentStatusBadgeProps) => {
  return (
    <span className={cn(`status-badge status-${status}`, className)}>
      {statusLabels[status]}
    </span>
  );
};

export default ShipmentStatusBadge;
