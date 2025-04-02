
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { ImportDatabaseItem } from '@/hooks/useImports';

export const useImportQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['import', id],
    queryFn: async () => {
      if (!id) throw new Error('Import ID is required');
      
      console.log("Fetching import with ID:", id);
      try {
        const { data, error } = await supabase
          .from('imports')
          .select('*')
          .eq('import_number', id)
          .maybeSingle();
        
        if (error) {
          console.error("Supabase error fetching import:", error);
          throw new Error(error.message);
        }
        
        if (!data) {
          console.error("Import not found:", id);
          throw new Error(`Import ${id} not found`);
        }
        
        console.log("Fetched import data:", data);
        return data as ImportDatabaseItem;
      } catch (err) {
        console.error("Error in import query:", err);
        throw err;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });
};

export const useUpdateImportMutation = (
  id: string | undefined, 
  queryClient: any, 
  onSuccessCallback: () => void
) => {
  return useMutation({
    mutationFn: async (updatedImport: any) => {
      if (!id) throw new Error('Import ID is required');
      
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
      
      if (error) {
        console.error("Error updating import:", error);
        throw error;
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import', id] });
      queryClient.invalidateQueries({ queryKey: ['imports'] });
      toast.success('Import shipment updated successfully');
      onSuccessCallback();
    },
    onError: (error) => {
      console.error('Error updating import:', error);
      toast.error('Failed to update import shipment');
    }
  });
};

export const useDeleteImportMutation = (id: string | undefined, navigate: any) => {
  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Import ID is required');
      
      console.log("Deleting import with ID:", id);
      const { error } = await supabase
        .from('imports')
        .delete()
        .eq('import_number', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast.success('Import shipment deleted successfully');
      navigate('/imports');
    },
    onError: (error) => {
      console.error('Error deleting import:', error);
      toast.error('Failed to delete import shipment');
    }
  });
};

export const useImportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const { 
    data: importData, 
    isLoading, 
    error,
    isError
  } = useImportQuery(id);
  
  return {
    id,
    importData,
    isLoading,
    error,
    isError,
    queryClient
  };
};

export default useImportDetail;
