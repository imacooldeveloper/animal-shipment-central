
import { useParams, useNavigate } from 'react-router-dom';
import { useShipmentData, UseShipmentDataReturn } from './useShipmentData';
import { useShipmentActions, UseShipmentActionsReturn } from './useShipmentActions';
import { Shipment } from '@/types';

export interface UseShipmentDetailReturn extends UseShipmentDataReturn, UseShipmentActionsReturn {
  id: string | undefined;
  navigate: any;
  isImport: boolean;
  isExport: boolean;
}

export const useShipmentDetail = (): UseShipmentDetailReturn => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Determine if this is an import or export by checking the ID format
  const isImport = id?.startsWith('IMP') ?? false;
  const isExport = id?.startsWith('EXP') ?? false;
  
  // Get shipment data
  const {
    shipment,
    checklist,
    loading,
    error,
    importData,
    exportData,
    notes
  } = useShipmentData(id, isImport, isExport);
  
  // Get shipment actions
  const {
    updateChecklist,
    saveChanges,
    calculateProgress,
    handleDeleteShipment
  } = useShipmentActions({
    id,
    shipment,
    checklist
  });

  return {
    id,
    navigate,
    isImport,
    isExport,
    shipment,
    checklist,
    loading,
    error,
    importData,
    exportData,
    notes,
    updateChecklist,
    saveChanges,
    calculateProgress,
    handleDeleteShipment
  };
};

export default useShipmentDetail;
