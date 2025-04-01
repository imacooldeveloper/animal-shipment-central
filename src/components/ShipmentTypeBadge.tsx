
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ShipmentTypeBadgeProps {
  type: 'import' | 'export';
  className?: string;
}

const typeLabels: Record<'import' | 'export', string> = {
  import: 'Import',
  export: 'Export'
};

const typeColors: Record<'import' | 'export', string> = {
  import: 'bg-app-green/20 text-app-green border-app-green/50',
  export: 'bg-app-blue/20 text-app-blue border-app-blue/50'
};

const ShipmentTypeBadge = ({ type, className }: ShipmentTypeBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(typeColors[type], className)}
    >
      {typeLabels[type]}
    </Badge>
  );
};

export default ShipmentTypeBadge;
