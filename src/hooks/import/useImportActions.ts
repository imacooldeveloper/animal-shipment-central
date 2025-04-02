
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from '@tanstack/react-query';

export interface UseImportActionsProps {
  id: string | undefined;
}

export interface UseImportActionsReturn {
  handleDelete: () => Promise<void>;
  handleUpdateImport: (updatedImport: any) => Promise<void>;
}

export const useImportActions = ({ id }: UseImportActionsProps): UseImportActionsReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleUpdateImport = async (updatedImport: any) => {
    if (!id) return;
    
    try {
      console.log("Updating import with ID:", id, "Data:", updatedImport);
      const { error } = await supabase
        .from('imports')
        .update({
          sending_lab: updatedImport.sendingLab,
          protocol_number: updatedImport.protocolNumber,
          courier: updatedImport.courier === 'Other' ? updatedImport.courierOther : updatedImport.courier,
          courier_account_number: updatedImport.courierAccountNumber,
          arrival_date: updatedImport.arrivalDate ? new Date(updatedImport.arrivalDate).toISOString().split('T')[0] : null,
          animal_type: updatedImport.animalType,
          quantity: updatedImport.quantity,
          status: updatedImport.status === 'Other' ? updatedImport.statusOther : updatedImport.status,
          notes: updatedImport.notes,
          lab_contact_name: updatedImport.labContactName,
          lab_contact_email: updatedImport.labContactEmail,
        })
        .eq('import_number', id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['import', id] });
      queryClient.invalidateQueries({ queryKey: ['imports'] });
      toast.success('Import shipment updated successfully');
      
    } catch (error: any) {
      console.error('Error updating import:', error);
      toast.error(`Failed to update import shipment: ${error.message}`);
      throw error;
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      console.log("Deleting import with ID:", id);
      const { error } = await supabase
        .from('imports')
        .delete()
        .eq('import_number', id);
      
      if (error) throw error;
      
      toast.success('Import shipment deleted successfully');
      navigate('/imports');
      
    } catch (error: any) {
      console.error('Error deleting import:', error);
      toast.error(`Failed to delete import shipment: ${error.message}`);
    }
  };

  return {
    handleDelete,
    handleUpdateImport
  };
};
