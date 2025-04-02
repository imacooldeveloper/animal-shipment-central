
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DEFAULT_CHECKLIST } from "@/components/imports/ImportChecklistCard";
import { DEFAULT_EXPORT_CHECKLIST } from "@/components/exports/ExportChecklistCard";

// Handler for import shipment submission
export const handleImportSubmit = async (data: any) => {
  // Format the arrival_date for Postgres
  const formattedData = {
    ...data,
    arrival_date: data.arrivalDate ? new Date(data.arrivalDate).toISOString().split('T')[0] : null
  };
  
  // Create a checklist based on form data
  const checklist = { ...DEFAULT_CHECKLIST };
  
  // Auto-populate checklist based on form data
  if (formattedData.sendingLab) checklist.transferForms = true;
  if (formattedData.courier) checklist.courier = true;
  if (formattedData.arrival_date) checklist.animalReceipt = true;
  if (formattedData.lab_contact_email && formattedData.lab_contact_name) {
    checklist.importPermit = true;
  }
  if (formattedData.animalType && formattedData.quantity) {
    checklist.healthCert = true;
  }
  
  // Remove fields that aren't in the database schema
  delete formattedData.arrivalDate;
  delete formattedData.documents;
  delete formattedData.type;
  
  const response = await supabase
    .from('imports')
    .insert({
      import_number: formattedData.importNumber,
      sending_lab: formattedData.sendingLab,
      protocol_number: formattedData.protocolNumber,
      courier: formattedData.courier,
      courier_account_number: formattedData.courierAccountNumber,
      arrival_date: formattedData.arrival_date,
      animal_type: formattedData.animalType,
      quantity: formattedData.quantity,
      status: formattedData.status,
      notes: formattedData.notes,
      lab_contact_name: formattedData.labContactName,
      lab_contact_email: formattedData.labContactEmail,
      checklist: JSON.stringify(checklist)
    } as any);
    
  if (response.error) throw response.error;
  return response;
};

// Handler for export shipment submission
export const handleExportSubmit = async (data: any) => {
  // Format the departure_date for Postgres
  const formattedData = {
    ...data,
    departure_date: data.departureDate ? new Date(data.departureDate).toISOString().split('T')[0] : null
  };
  
  // Create a checklist based on form data
  const checklist = { ...DEFAULT_EXPORT_CHECKLIST };
  
  // Auto-populate checklist based on form data
  if (formattedData.sendingLab && formattedData.destinationLab) checklist.transferForms = true;
  if (formattedData.courier) checklist.courier = true;
  if (formattedData.departure_date) checklist.pickupDate = true;
  if (formattedData.lab_contact_email && formattedData.lab_contact_name) {
    checklist.exportPermit = true;
  }
  if (formattedData.animalType && formattedData.quantity) {
    checklist.healthCert = true;
  }
  
  // Remove fields that aren't in the database schema
  delete formattedData.departureDate;
  delete formattedData.documents;
  delete formattedData.type;
  delete formattedData.courierOther;
  delete formattedData.statusOther;
  
  console.log('Formatted export data for DB insertion:', formattedData);
  
  const exportData = {
    export_number: formattedData.exportNumber,
    sending_lab: formattedData.sendingLab,
    destination_lab: formattedData.destinationLab,
    protocol_number: formattedData.protocolNumber,
    courier: formattedData.courier,
    courier_account_number: formattedData.courierAccountNumber,
    departure_date: formattedData.departure_date,
    animal_type: formattedData.animalType,
    quantity: formattedData.quantity,
    status: formattedData.status,
    tracking_number: formattedData.trackingNumber,
    notes: formattedData.notes,
    lab_contact_name: formattedData.labContactName,
    lab_contact_email: formattedData.labContactEmail,
    checklist: JSON.stringify(checklist)
  };
  
  const response = await supabase
    .from('exports')
    .insert(exportData);
    
  if (response.error) {
    console.error('Supabase error details:', response.error);
    throw response.error;
  }
  return response;
};
