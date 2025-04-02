
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ImportDatabaseItem } from '@/hooks/useImports';

export interface UseImportDataProps {
  id: string | undefined;
}

export interface UseImportDataReturn {
  importData: ImportDatabaseItem | null;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

export const useImportData = ({ id }: UseImportDataProps): UseImportDataReturn => {
  const { 
    data, 
    isLoading, 
    error,
    isError
  } = useQuery({
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

  return {
    importData: data || null,
    isLoading,
    error: error as Error | null,
    isError
  };
};
