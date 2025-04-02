
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shipment } from '@/types';
import { Pencil, Upload } from 'lucide-react';

interface ShipmentOverviewProps {
  shipment: Shipment;
  calculateProgress: () => number;
}

const ShipmentOverview = ({ shipment, calculateProgress }: ShipmentOverviewProps) => {
  const progress = calculateProgress();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Country</p>
          <p>{shipment.country}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Type</p>
          <p className="capitalize">{shipment.type}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Animal Type</p>
          <p>{shipment.animalType}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
          <p>{shipment.lastUpdated}</p>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">Shipment Progress</h3>
          <span className="text-sm text-muted-foreground">{progress}% Complete</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-4">
        <Button variant="outline" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Details
        </Button>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>
    </div>
  );
};

export default ShipmentOverview;
