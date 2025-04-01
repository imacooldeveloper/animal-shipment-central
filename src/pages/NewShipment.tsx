
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
import ImportShipmentForm from '@/components/shipments/ImportShipmentForm';
import ExportShipmentForm from '@/components/shipments/ExportShipmentForm';

const NewShipment = () => {
  const [shipmentType, setShipmentType] = useState<'import' | 'export'>('import');
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = (data: any) => {
    console.log('Shipment data submitted:', data);
    // Would normally save to API/database here
    navigate(`/${shipmentType}s`);
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
              <ImportShipmentForm onSubmit={handleSubmit} onCancel={handleCancel} />
            </TabsContent>
            
            <TabsContent value="export">
              <ExportShipmentForm onSubmit={handleSubmit} onCancel={handleCancel} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewShipment;
