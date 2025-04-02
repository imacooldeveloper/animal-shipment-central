
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Box, Clipboard, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ShipmentDetailContent from '@/components/shipments/ShipmentDetailContent';
import ShipmentNotes from '@/components/shipments/ShipmentNotes';
import { Shipment } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { ImportDatabaseItem } from '@/hooks/useImports';
import { ExportDatabaseItem } from '@/pages/Exports';
import ImportShipmentView from '@/components/imports/ImportShipmentView';
import ExportShipmentView from '@/components/exports/ExportShipmentView';

const ShipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [checklist, setChecklist] = useState<Shipment['checklist'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importData, setImportData] = useState<ImportDatabaseItem | null>(null);
  const [exportData, setExportData] = useState<ExportDatabaseItem | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  
  // Determine if this is an import or export by checking the ID format
  const isImport = id?.startsWith('IMP');
  const isExport = id?.startsWith('EXP');
  
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
            .single();
          
          if (error) throw error;
          
          console.log('Fetched import data:', data);
          
          if (data) {
            setImportData(data);
            
            // Parse notes if they exist and are in JSON format
            if (data.notes) {
              try {
                const parsedNotes = JSON.parse(data.notes);
                if (Array.isArray(parsedNotes)) {
                  setNotes(parsedNotes);
                }
              } catch (e) {
                // If notes is not valid JSON, treat it as a single note
                setNotes([{
                  id: '1',
                  content: data.notes,
                  created_at: data.created_at
                }]);
              }
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
          } else {
            setError('Import not found');
          }
        } else if (isExport) {
          // Fetch export details
          const { data, error } = await supabase
            .from('exports')
            .select('*')
            .eq('export_number', id)
            .single();
          
          if (error) throw error;
          
          console.log('Fetched export data:', data);
          
          if (data) {
            setExportData(data);
            
            // Parse notes if they exist and are in JSON format
            if (data.notes) {
              try {
                const parsedNotes = JSON.parse(data.notes);
                if (Array.isArray(parsedNotes)) {
                  setNotes(parsedNotes);
                }
              } catch (e) {
                // If notes is not valid JSON, treat it as a single note
                setNotes([{
                  id: '1',
                  content: data.notes,
                  created_at: data.created_at
                }]);
              }
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
            setError('Export not found');
          }
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex space-x-2">
          <div className="h-3 w-3 bg-rose-300 rounded-full animate-pulse"></div>
          <div className="h-3 w-3 bg-rose-400 rounded-full animate-pulse delay-150"></div>
          <div className="h-3 w-3 bg-rose-500 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    );
  }
  
  if (error || !shipment) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12 border rounded-md">
          <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Shipment Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "We couldn't find the shipment you're looking for."}
          </p>
          <Button onClick={() => navigate(-1)}>
            Return to Previous Page
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mt-2">{shipment.id}</h1>
          <p className="text-muted-foreground">
            View and manage {shipment.type === 'import' ? 'import' : 'export'} shipment details
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Clipboard className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  shipment and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteShipment}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {isImport && importData ? (
        <div className="space-y-6">
          <ImportShipmentView importData={importData} />
          <ShipmentNotes 
            shipmentId={importData.import_number} 
            shipmentType="import" 
            existingNotes={notes}
          />
        </div>
      ) : isExport && exportData ? (
        <div className="space-y-6">
          <ExportShipmentView exportData={exportData} />
          <ShipmentNotes 
            shipmentId={exportData.export_number} 
            shipmentType="export" 
            existingNotes={notes}
          />
        </div>
      ) : (
        <ShipmentDetailContent
          shipment={shipment}
          checklist={checklist!}
          updateChecklist={updateChecklist}
          onSaveChanges={saveChanges}
          calculateProgress={calculateProgress}
        />
      )}
    </div>
  );
};

export default ShipmentDetail;
