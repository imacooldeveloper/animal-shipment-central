
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import ShipmentTabs from '@/components/shipments/creation/ShipmentTabs';
import ChecklistContainer from '@/components/shipments/creation/ChecklistContainer';
import { handleImportSubmit, handleExportSubmit } from '@/components/shipments/creation/DataHandlers';

const NewShipment = () => {
  const [shipmentType, setShipmentType] = useState<'import' | 'export'>('import');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const navigate = useNavigate();

  const handleCancel = () => navigate(-1);

  const handleSubmit = async (data: any) => {
    console.log('Form data received for submission:', data);
    setIsSubmitting(true);
    setFormData(data);
    
    try {
      let response;
      
      if (shipmentType === 'import') {
        response = await handleImportSubmit(data);
      } else {
        response = await handleExportSubmit(data);
      }
      
      console.log('Submission response:', response);
      
      if (response.error) {
        throw response.error;
      }
      
      toast.success(`${shipmentType === 'import' ? 'Import' : 'Export'} successfully created!`);
      navigate(`/${shipmentType}s`);
    } catch (error: any) {
      console.error(`Error saving ${shipmentType}:`, error);
      toast.error(`Failed to create ${shipmentType}: ${error.message || 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Shipment</h1>
        <p className="text-muted-foreground">
          Create a new animal shipment record
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Shipment Details</CardTitle>
              <CardDescription>
                Fill out the details for your new shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShipmentTabs 
                shipmentType={shipmentType}
                setShipmentType={setShipmentType}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <ChecklistContainer 
            shipmentType={shipmentType}
            formData={formData}
          />
        </div>
      </div>
    </div>
  );
};

export default NewShipment;
