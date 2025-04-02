
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';
import ShipmentDetailContent from '@/components/shipments/ShipmentDetailContent';
import { mockShipments } from '@/data/mockData';
import { Shipment } from '@/types';

const ShipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const shipment = mockShipments.find(s => s.id === id);
  
  const [checklist, setChecklist] = useState<Shipment['checklist']>(
    shipment?.checklist || {
      transferForms: false,
      healthCert: false,
      exportPermit: false,
      courier: false,
      pickupDate: false,
      packageReady: false,
    }
  );
  
  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-2xl font-semibold mb-4">Shipment Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The shipment with ID {id} could not be found.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }
  
  const updateChecklist = (key: keyof Shipment['checklist'], value: boolean) => {
    setChecklist(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const calculateProgress = () => {
    const totalItems = Object.keys(checklist).length;
    const completedItems = Object.values(checklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    console.log("Saving checklist:", checklist);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Shipment {shipment.id}</h1>
        <ShipmentStatusBadge status={shipment.status} className="ml-auto" />
      </div>
      
      <ShipmentDetailContent 
        shipment={shipment}
        checklist={checklist}
        updateChecklist={updateChecklist}
        onSaveChanges={handleSaveChanges}
        calculateProgress={calculateProgress}
      />
    </div>
  );
};

export default ShipmentDetail;
