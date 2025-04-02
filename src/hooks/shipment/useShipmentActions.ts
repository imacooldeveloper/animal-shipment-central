
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Shipment } from '@/types';

export interface UseShipmentActionsProps {
  id: string | undefined;
  shipment: Shipment | null;
  checklist: Shipment['checklist'] | null;
}

export interface UseShipmentActionsReturn {
  updateChecklist: (key: keyof Shipment['checklist'], value: boolean) => Promise<void>;
  saveChanges: () => void;
  calculateProgress: () => number;
  handleDeleteShipment: () => Promise<void>;
}

export const useShipmentActions = ({
  id,
  shipment,
  checklist
}: UseShipmentActionsProps): UseShipmentActionsReturn => {
  const navigate = useNavigate();

  const updateChecklist = async (key: keyof Shipment['checklist'], value: boolean) => {
    if (!shipment || !checklist || !id) return;
    
    const newChecklist = { ...checklist, [key]: value };
    
    // Update the database
    try {
      const tableName = shipment.type === 'import' ? 'imports' : 'exports';
      const idField = shipment.type === 'import' ? 'import_number' : 'export_number';
      
      const { error } = await supabase
        .from(tableName)
        .update({ 
          checklist: JSON.stringify(newChecklist) 
        })
        .eq(idField, shipment.id);
      
      if (error) throw error;
      
    } catch (err: any) {
      console.error('Error updating checklist:', err);
      toast.error(`Failed to update checklist: ${err.message}`);
    }
  };
  
  const saveChanges = () => {
    toast.success('Changes saved successfully');
  };
  
  const calculateProgress = () => {
    if (!checklist) return 0;
    
    const items = Object.values(checklist);
    const completedItems = items.filter(Boolean).length;
    return (completedItems / items.length) * 100;
  };
  
  const handleDeleteShipment = async () => {
    if (!shipment) return;
    
    try {
      const tableName = shipment.type === 'import' ? 'imports' : 'exports';
      const idField = shipment.type === 'import' ? 'import_number' : 'export_number';
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq(idField, shipment.id);
      
      if (error) throw error;
      
      toast.success(`${shipment.type === 'import' ? 'Import' : 'Export'} deleted successfully`);
      navigate(`/${shipment.type}s`);
      
    } catch (err: any) {
      console.error('Error deleting shipment:', err);
      toast.error(`Failed to delete: ${err.message}`);
    }
  };

  return {
    updateChecklist,
    saveChanges,
    calculateProgress,
    handleDeleteShipment
  };
};
