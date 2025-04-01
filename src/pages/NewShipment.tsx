
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ImportShipmentForm from '@/components/shipments/ImportShipmentForm';
import ExportShipmentForm from '@/components/shipments/ExportShipmentForm';

const NewShipment = () => {
  const [shipmentType, setShipmentType] = useState<'import' | 'export'>('import');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    console.log('Shipment data submitted:', data);
    
    try {
      let response;
      
      if (shipmentType === 'import') {
        // Format the arrival_date for Postgres
        const formattedData = {
          ...data,
          arrival_date: data.arrivalDate ? new Date(data.arrivalDate).toISOString().split('T')[0] : null
        };
        
        // Remove fields that aren't in the database schema
        delete formattedData.arrivalDate;
        delete formattedData.documents;
        delete formattedData.type;
        
        response = await supabase
          .from('imports')
          .insert({
            import_number: formattedData.importNumber,
            sending_lab: formattedData.sendingLab,
            protocol_number: formattedData.protocolNumber,
            courier: formattedData.courier,
            courier_account_number: formattedData.courierAccountNumber,
            arrival_date: formattedData.arrival_date,
            animal_type: formattedData.animalType,
            quantity: formattedData.quantity,
            status: formattedData.status,
            notes: formattedData.notes,
            lab_contact_name: formattedData.labContactName,
            lab_contact_email: formattedData.labContactEmail
          });
      } else {
        // Format the departure_date for Postgres
        const formattedData = {
          ...data,
          departure_date: data.departureDate ? new Date(data.departureDate).toISOString().split('T')[0] : null
        };
        
        // Remove fields that aren't in the database schema
        delete formattedData.departureDate;
        delete formattedData.documents;
        delete formattedData.type;
        
        response = await supabase
          .from('exports')
          .insert({
            export_number: formattedData.exportNumber,
            sending_lab: formattedData.sendingLab,
            destination_lab: formattedData.destinationLab,
            protocol_number: formattedData.protocolNumber,
            courier: formattedData.courier,
            courier_account_number: formattedData.courierAccountNumber,
            departure_date: formattedData.departure_date,
            animal_type: formattedData.animalType,
            quantity: formattedData.quantity,
            status: formattedData.status,
            tracking_number: formattedData.trackingNumber,
            notes: formattedData.notes,
            lab_contact_name: formattedData.labContactName,
            lab_contact_email: formattedData.labContactEmail
          });
      }
      
      if (response.error) {
        throw response.error;
      }
      
      toast.success(`${shipmentType === 'import' ? 'Import' : 'Export'} successfully created!`);
      navigate(`/${shipmentType}s`);
    } catch (error) {
      console.error('Error saving shipment:', error);
      toast.error(`Failed to create ${shipmentType}. Please try again.`);
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
      
      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
          <CardDescription>
            Fill out the details for your new shipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="import" 
            onValueChange={(value) => setShipmentType(value as 'import' | 'export')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="import">Import Shipment</TabsTrigger>
              <TabsTrigger value="export">Export Shipment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="import">
              <ImportShipmentForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
            </TabsContent>
            
            <TabsContent value="export">
              <ExportShipmentForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewShipment;
