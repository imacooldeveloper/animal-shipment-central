
import { TimelineEvent } from '@/types';

interface ShipmentTimelineProps {
  events: TimelineEvent[];
}

const ShipmentTimeline = ({ events }: ShipmentTimelineProps) => {
  // Return early if there are no events
  if (!events || events.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Shipment Timeline</h3>
        <div className="text-center py-4 border rounded-md">
          <p className="text-muted-foreground">No timeline events available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Shipment Timeline</h3>
      
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="relative pl-6">
            {index !== events.length - 1 && (
              <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-muted"></div>
            )}
            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary"></div>
            <div className="space-y-1">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">{event.timestamp}</p>
              <p className="text-sm">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentTimeline;
