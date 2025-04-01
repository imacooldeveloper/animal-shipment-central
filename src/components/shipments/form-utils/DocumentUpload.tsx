
import { useState } from 'react';
import { X } from 'lucide-react';
import { FormDescription, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DocumentUploadProps {
  documentFiles: File[];
  setDocumentFiles: React.Dispatch<React.SetStateAction<File[]>>;
  description?: string;
}

const DocumentUpload = ({ 
  documentFiles, 
  setDocumentFiles, 
  description = "Upload required documents"
}: DocumentUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeFile = (index: number) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <FormLabel>Documents</FormLabel>
      <div className="flex items-center gap-4">
        <Input
          type="file"
          multiple
          onChange={handleFileChange}
          className="max-w-sm"
        />
        <FormDescription>
          {description}
        </FormDescription>
      </div>

      {documentFiles.length > 0 && (
        <div className="border rounded-md p-4">
          <p className="font-medium mb-2">Attached Files:</p>
          <ul className="space-y-2">
            {documentFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                <span className="truncate flex-1">{file.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFile(index)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
