
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImportDatabaseItem } from '@/hooks/useImports';
import { ExportDatabaseItem } from '@/pages/Exports';
import { Shipment } from '@/types';

interface Note {
  id: string;
  content: string;
  created_at: string;
  user_name?: string;
}

interface UseShipmentDetailReturn {
  id: string | undefined;
  navigate: any;
  isImport: boolean;
  isExport: boolean;
  shipment: Shipment | null;
  checklist: Shipment['checklist'] | null;
  loading: boolean;
  error: string | null;
  importData: ImportDatabaseItem | null;
  exportData: ExportDatabaseItem | null;
  notes: Note[] | string;
  updateChecklist: (key: keyof Shipment['checklist'], value: boolean) => Promise<void>;
  saveChanges: () => void;
  calculateProgress: () => number;
  handleDeleteShipment: () => Promise<void>;
}

export const useShipmentDetail = (): UseShipmentDetailReturn => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [checklist, setChecklist] = useState<Shipment['checklist'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importData, setImportData] = useState<ImportDatabaseItem | null>(null);
  const [exportData, setExportData] = useState<ExportDatabaseItem | null>(null);
  const [notes, setNotes] = useState<Note[] | string>([]);
  
  // Determine if this is an import or export by checking the ID format
  const isImport = id?.startsWith('IMP') ?? false;
  const isExport = id?.startsWith('EXP') ?? false;
  
  useEffect(() => {
    const fetchShipmentDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching shipment details for ID: ${id}`);
        
        if (isImport) {
          // Fetch import details
          const { data, error } = await supabase
            .from('imports')
            .select('*')
            .eq('import_number', id)
            .maybeSingle();
          
          if (error) {
            console.error("Error fetching import:", error);
            throw error;
          }
          
          if (!data) {
            console.error("Import not found:", id);
            throw new Error(`Import ${id} not found`);
          }
          
          console.log('Fetched import data:', data);
          
          setImportData(data);
          
          // Handle notes
          if (data.notes) {
            setNotes(data.notes);
          }
          
          // Parse checklist if it exists
          const parsedChecklist = data.checklist ? JSON.parse(data.checklist) : null;
          
          // Map the database data to our Shipment type
          setShipment({
            id: data.import_number,
            type: 'import',
            status: data.status === 'complete' ? 'complete' : 
                   data.status === 'in-progress' ? 'progress' : 'draft',
            country: 'N/A', // Use a more meaningful value if available
            lastUpdated: new Date(data.created_at).toLocaleDateString(),
            animalType: data.animal_type,
            lab: data.sending_lab,
            arrivalDate: data.arrival_date,
            courier: data.courier,
            checklist: parsedChecklist || {
              transferForms: false,
              healthCert: false,
              importPermit: false,
              courier: false,
              animalReceipt: false,
              facilitiesReady: false
            },
            documents: [],
            timeline: [],
            labContactName: data.lab_contact_name,
            labContactEmail: data.lab_contact_email
          });
          
          setChecklist(parsedChecklist || {
            transferForms: false,
            healthCert: false,
            importPermit: false,
            courier: false,
            animalReceipt: false,
            facilitiesReady: false
          });
        } else if (isExport) {
          // Fetch export details
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
          
          console.log('Fetched export data:', data);
          
          setExportData(data);
          
          // Handle notes
          if (data.notes) {
            setNotes(data.notes);
          }
          
          // Parse checklist if it exists
          const parsedChecklist = data.checklist ? JSON.parse(data.checklist) : null;
          
          // Map the database data to our Shipment type
          setShipment({
            id: data.export_number,
            type: 'export',
            status: data.status === 'complete' ? 'complete' : 
                   data.status === 'in-progress' ? 'progress' : 'draft',
            country: data.destination_lab.split(',').length > 1 ? 
                    data.destination_lab.split(',')[1].trim() : 'Unknown',
            lastUpdated: new Date(data.created_at).toLocaleDateString(),
            animalType: data.animal_type,
            lab: data.destination_lab,
            departureDate: data.departure_date,
            courier: data.courier,
            checklist: parsedChecklist || {
              transferForms: false,
              healthCert: false,
              exportPermit: false,
              courier: false,
              pickupDate: false,
              packageReady: false
            },
            documents: [],
            timeline: [],
            labContactName: data.lab_contact_name,
            labContactEmail: data.lab_contact_email
          });
          
          setChecklist(parsedChecklist || {
            transferForms: false,
            healthCert: false,
            exportPermit: false,
            courier: false,
            pickupDate: false,
            packageReady: false
          });
        } else {
          setError('Invalid shipment ID format');
        }
      } catch (err: any) {
        console.error('Error fetching shipment details:', err);
        setError(err.message || 'Failed to load shipment details');
        toast.error(`Error: ${err.message || 'Failed to load shipment details'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShipmentDetails();
  }, [id, isImport, isExport]);
  
  const updateChecklist = async (key: keyof Shipment['checklist'], value: boolean) => {
    if (!shipment || !checklist) return;
    
    const newChecklist = { ...checklist, [key]: value };
    setChecklist(newChecklist);
    
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
      // Revert the change if the update failed
      setChecklist(checklist);
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
