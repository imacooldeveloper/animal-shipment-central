
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useExportData } from './useExportData';
import { useExportActions } from './useExportActions';

export const useExportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  // Get export data
  const { 
    exportData, 
    isLoading, 
    error,
    isError
  } = useExportData({ id });
  
  // Get export actions
  const {
    handleDelete,
    handleUpdateExport
  } = useExportActions({ id });

  return {
    id,
    exportData,
    isLoading,
    error,
    isError,
    queryClient,
    handleDelete,
    handleUpdateExport
  };
};

export default useExportDetail;
