
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { ExportDatabaseItem } from '@/pages/Exports';

export const useExportQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['export', id],
    queryFn: async () => {
      if (!id) throw new Error('Export ID is required');
      
      console.log("Fetching export with ID:", id);
      const { data, error } = await supabase
        .from('exports')
        .select('*')
        .eq('export_number', id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching export:", error);
        throw error;
      }
      
      if (!data) {
        console.error("Export not found:", id);
        throw new Error(`Export ${id} not found`);
      }
      
      console.log("Fetched export data:", data);
      return data as ExportDatabaseItem;
    },
    retry: 1,
    refetchOnWindowFocus: false
  });
};

export const useUpdateExportMutation = (
  id: string | undefined, 
  queryClient: any, 
  onSuccessCallback: () => void
) => {
  return useMutation({
    mutationFn: async (updatedExport: any) => {
      if (!id) throw new Error('Export ID is required');
      
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
      
      if (error) {
        console.error("Error updating export:", error);
        throw error;
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export', id] });
      queryClient.invalidateQueries({ queryKey: ['exports'] });
      toast.success('Export shipment updated successfully');
      onSuccessCallback();
    },
    onError: (error) => {
      console.error('Error updating export:', error);
      toast.error('Failed to update export shipment');
    }
  });
};

export const useDeleteExportMutation = (id: string | undefined, navigate: any) => {
  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Export ID is required');
      
      console.log("Deleting export with ID:", id);
      const { error } = await supabase
        .from('exports')
        .delete()
        .eq('export_number', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast.success('Export shipment deleted successfully');
      navigate('/exports');
    },
    onError: (error) => {
      console.error('Error deleting export:', error);
      toast.error('Failed to delete export shipment');
    }
  });
};

export const useExportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const { 
    data: exportData, 
    isLoading, 
    error,
    isError
  } = useExportQuery(id);
  
  return {
    id,
    exportData,
    isLoading,
    error,
    isError,
    queryClient
  };
};

export default useExportDetail;
