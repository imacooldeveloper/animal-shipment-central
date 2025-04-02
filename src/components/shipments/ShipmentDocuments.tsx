
import { Button } from '@/components/ui/button';
import { Document, Shipment } from '@/types';
import { Download, Eye, FileText, Plus } from 'lucide-react';

interface ShipmentDocumentsProps {
  documents: Document[];
}

const ShipmentDocuments = ({ documents }: ShipmentDocumentsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Associated Documents</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">No documents have been added yet.</p>
          <Button className="mt-4" variant="outline">Upload Document</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Added: {doc.dateAdded}
                    {doc.expirationDate && ` · Expires: ${doc.expirationDate}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShipmentDocuments;
