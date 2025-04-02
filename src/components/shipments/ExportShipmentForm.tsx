
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import DocumentUpload from './form-utils/DocumentUpload';
import ShipmentFormFooter from './form-utils/ShipmentFormFooter';
import CourierFields from './forms/CourierFields';
import StatusFields from './forms/StatusFields';
import LabContactFields from './forms/LabContactFields';
import NotesField from './forms/NotesField';
import ExportDetailsFields from './forms/ExportDetailsFields';
import { exportFormSchema, type ExportFormValues } from './forms/exportFormSchema';
import { ExportShipment } from '@/types';

interface ExportShipmentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: any;
  isEditing?: boolean;
  formId?: string;
}

const ExportShipmentForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  initialData,
  isEditing = false,
  formId
}: ExportShipmentFormProps) => {
  const defaultValues = initialData || {
    exportNumber: `EXP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    sendingLab: "Our Facility",
    trackingNumber: "",
    notes: "",
  };
  
  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportFormSchema),
    defaultValues,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const [documentFiles, setDocumentFiles] = useState<File[]>([]);

  const handleFormSubmit = (values: ExportFormValues) => {
    let finalCourier = values.courier;
    if (values.courier === "Other" && values.courierOther) {
      finalCourier = values.courierOther;
    }
    
    let finalStatus = values.status;
    if (values.status === "Other" && values.statusOther) {
      finalStatus = values.statusOther;
    }
    
    onSubmit({
      ...values,
      courier: finalCourier,
      status: finalStatus,
      documents: documentFiles,
      type: 'export'
    } as ExportShipment);
  };

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <ExportDetailsFields />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LabContactFields />
          </div>
          
          <div className="space-y-6">
            <CourierFields />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <StatusFields />
          </div>
        </div>

        <NotesField />

        <DocumentUpload 
          documentFiles={documentFiles} 
          setDocumentFiles={setDocumentFiles} 
          description="Upload permits, labels, signed forms, etc."
        />

        <ShipmentFormFooter 
          onCancel={onCancel} 
          buttonLabel={isEditing ? "Update Export" : "Create Export"} 
          buttonColor="bg-blue-600 hover:bg-blue-700"
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default ExportShipmentForm;
