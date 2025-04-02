
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useImportData } from './useImportData';
import { useImportActions } from './useImportActions';

export const useImportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  // Get import data
  const { 
    importData, 
    isLoading, 
    error,
    isError
  } = useImportData({ id });
  
  // Get import actions
  const {
    handleDelete,
    handleUpdateImport
  } = useImportActions({ id });

  return {
    id,
    importData,
    isLoading,
    error,
    isError,
    queryClient,
    handleDelete,
    handleUpdateImport
  };
};

export default useImportDetail;
