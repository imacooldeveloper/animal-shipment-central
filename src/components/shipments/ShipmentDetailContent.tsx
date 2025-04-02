
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shipment } from '@/types';
import ShipmentOverview from './ShipmentOverview';
import ShipmentDocuments from './ShipmentDocuments';
import ShipmentTimeline from './ShipmentTimeline';
import ShipmentChecklist from './ShipmentChecklist';

interface ShipmentDetailContentProps {
  shipment: Shipment;
  checklist: Shipment['checklist'];
  updateChecklist: (key: keyof Shipment['checklist'], value: boolean) => void;
  onSaveChanges: () => void;
  calculateProgress: () => number;
}

const ShipmentDetailContent = ({
  shipment,
  checklist,
  updateChecklist,
  onSaveChanges,
  calculateProgress
}: ShipmentDetailContentProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-6">
      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
          <CardDescription>View and manage shipment information</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <ShipmentOverview 
                shipment={shipment} 
                calculateProgress={calculateProgress} 
              />
            </TabsContent>
            
            <TabsContent value="documents">
              <ShipmentDocuments documents={shipment.documents} />
            </TabsContent>
            
            <TabsContent value="timeline">
              <ShipmentTimeline events={shipment.timeline} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="md:col-span-2">
        <ShipmentChecklist
          shipment={shipment}
          checklist={checklist}
          updateChecklist={updateChecklist}
          onSaveChanges={onSaveChanges}
          calculateProgress={calculateProgress}
        />
      </div>
    </div>
  );
};

export default ShipmentDetailContent;
