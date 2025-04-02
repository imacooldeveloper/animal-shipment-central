import { useState, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { ImportShipment } from '@/types';
import { Separator } from "@/components/ui/separator";

import DocumentUpload from './form-utils/DocumentUpload';
import ShipmentFormFooter from './form-utils/ShipmentFormFooter';
import ImportDetailsFields from './forms/ImportDetailsFields';
import CourierFields from './forms/CourierFields';
import LabContactFields from './forms/LabContactFields';
import StatusFields from './forms/StatusFields';
import NotesField from './forms/NotesField';
import { importFormSchema, type ImportFormValues } from './forms/importFormSchema';

interface ImportShipmentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<ImportShipment>;
  isEditing?: boolean;
  formId?: string;
}

const ImportShipmentForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  initialData,
  isEditing = false,
  formId = "import-shipment-form"
}: ImportShipmentFormProps) => {
  const defaultValues: ImportFormValues = {
    importNumber: initialData?.importNumber || `IMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    sendingLab: initialData?.sendingLab || "",
    protocolNumber: initialData?.protocolNumber || "",
    courier: initialData?.courier || "",
    courierOther: "",
    courierAccountNumber: initialData?.courierAccountNumber || "",
    arrivalDate: initialData?.arrivalDate,
    animalType: initialData?.animalType || "",
    quantity: initialData?.quantity || "",
    status: initialData?.status || "",
    statusOther: "",
    notes: initialData?.notes || "",
    labContactName: initialData?.labContactName || "",
    labContactEmail: initialData?.labContactEmail || "",
  };

  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues,
  });

  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (onSubmit && typeof onSubmit === 'function') {
        if (debounceTimer) clearTimeout(debounceTimer);
        
        const timer = setTimeout(() => {
          const currentValues = form.getValues();
          if (currentValues.sendingLab) {
            onSubmit(currentValues);
          }
        }, 500);
        
        setDebounceTimer(timer);
      }
    });
    
    return () => {
      subscription.unsubscribe();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [form, onSubmit, debounceTimer]);

  const handleFormSubmit = (values: ImportFormValues) => {
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
      type: 'import'
    } as ImportShipment);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (document.activeElement?.tagName === 'INPUT') {
        window.scrollTo(window.scrollX, window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8" id={formId}>
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImportDetailsFields />
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Shipping Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CourierFields />
              <StatusFields />
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Lab Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LabContactFields />
            </div>
          </div>

          <NotesField />

          {!isEditing && (
            <>
              <Separator />
              <DocumentUpload 
                documentFiles={documentFiles} 
                setDocumentFiles={setDocumentFiles} 
                description="Upload health certificates, customs documents, etc."
              />
            </>
          )}

          {!formId.includes("edit") && (
            <ShipmentFormFooter 
              onCancel={onCancel} 
              buttonLabel={isEditing ? "Save Changes" : "Create Import"} 
              buttonColor="bg-emerald-600 hover:bg-emerald-700"
              isSubmitting={isSubmitting}
            />
          )}
        </form>
      </Form>
    </FormProvider>
  );
};

export default ImportShipmentForm;
