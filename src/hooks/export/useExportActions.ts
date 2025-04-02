
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from '@tanstack/react-query';

export interface UseExportActionsProps {
  id: string | undefined;
}

export interface UseExportActionsReturn {
  handleDelete: () => Promise<void>;
  handleUpdateExport: (updatedExport: any) => Promise<void>;
}

export const useExportActions = ({ id }: UseExportActionsProps): UseExportActionsReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleUpdateExport = async (updatedExport: any) => {
    if (!id) return;
    
    try {
      console.log("Updating export with ID:", id, "Data:", updatedExport);
      const { error } = await supabase
        .from('exports')
        .update({
          sending_lab: updatedExport.sendingLab,
          destination_lab: updatedExport.destinationLab,
          protocol_number: updatedExport.protocolNumber,
          courier: updatedExport.courier === 'Other' ? updatedExport.courierOther : updatedExport.courier,
          courier_account_number: updatedExport.courierAccountNumber,
          departure_date: updatedExport.departureDate ? new Date(updatedExport.departureDate).toISOString().split('T')[0] : null,
          animal_type: updatedExport.animalType,
          quantity: updatedExport.quantity,
          status: updatedExport.status === 'Other' ? updatedExport.statusOther : updatedExport.status,
          notes: updatedExport.notes,
          lab_contact_name: updatedExport.labContactName,
          lab_contact_email: updatedExport.labContactEmail,
          tracking_number: updatedExport.trackingNumber,
        })
        .eq('export_number', id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['export', id] });
      queryClient.invalidateQueries({ queryKey: ['exports'] });
      toast.success('Export shipment updated successfully');
      
    } catch (error: any) {
      console.error('Error updating export:', error);
      toast.error(`Failed to update export shipment: ${error.message}`);
      throw error;
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      console.log("Deleting export with ID:", id);
      const { error } = await supabase
        .from('exports')
        .delete()
        .eq('export_number', id);
      
      if (error) throw error;
      
      toast.success('Export shipment deleted successfully');
      navigate('/exports');
      
    } catch (error: any) {
      console.error('Error deleting export:', error);
      toast.error(`Failed to delete export shipment: ${error.message}`);
    }
  };

  return {
    handleDelete,
    handleUpdateExport
  };
};
