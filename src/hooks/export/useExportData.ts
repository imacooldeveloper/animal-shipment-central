
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExportDatabaseItem } from '@/pages/Exports';

export interface UseExportDataProps {
  id: string | undefined;
}

export interface UseExportDataReturn {
  exportData: ExportDatabaseItem | null;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

export const useExportData = ({ id }: UseExportDataProps): UseExportDataReturn => {
  const { 
    data, 
    isLoading, 
    error,
    isError
  } = useQuery({
    queryKey: ['export', id],
    queryFn: async () => {
      if (!id) throw new Error('Export ID is required');
      
      console.log("Fetching export with ID:", id);
      try {
        const { data, error } = await supabase
          .from('exports')
          .select('*')
          .eq('export_number', id)
          .maybeSingle();
        
        if (error) {
          console.error("Supabase error fetching export:", error);
          throw new Error(error.message);
        }
        
        if (!data) {
          console.error("Export not found:", id);
          throw new Error(`Export ${id} not found`);
        }
        
        console.log("Fetched export data:", data);
        return data as ExportDatabaseItem;
      } catch (err) {
        console.error("Error in export query:", err);
        throw err;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  return {
    exportData: data || null,
    isLoading,
    error: error as Error | null,
    isError
  };
};
