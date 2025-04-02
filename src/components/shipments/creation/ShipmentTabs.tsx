
/**
 * This component is deprecated and no longer in use.
 * We've moved to dedicated forms for imports and exports without tabs.
 * Keeping this file for reference in case we need to revert or adapt later.
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImportShipmentForm from '@/components/shipments/ImportShipmentForm';
import ExportShipmentForm from '@/components/shipments/ExportShipmentForm';

interface ShipmentTabsProps {
  shipmentType: 'import' | 'export';
  setShipmentType: (type: 'import' | 'export') => void;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ShipmentTabs = ({ 
  shipmentType, 
  setShipmentType, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: ShipmentTabsProps) => {
  return (
    <Tabs 
      defaultValue={shipmentType} 
      onValueChange={(value) => setShipmentType(value as 'import' | 'export')}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="import">Import Shipment</TabsTrigger>
        <TabsTrigger value="export">Export Shipment</TabsTrigger>
      </TabsList>
      
      <TabsContent value="import" className="pt-2">
        <ImportShipmentForm 
          onSubmit={onSubmit} 
          onCancel={onCancel} 
          isSubmitting={isSubmitting} 
        />
      </TabsContent>
      
      <TabsContent value="export" className="pt-2">
        <ExportShipmentForm 
          onSubmit={onSubmit} 
          onCancel={onCancel} 
          isSubmitting={isSubmitting} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ShipmentTabs;
