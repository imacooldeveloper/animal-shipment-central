
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  FileText,
  Globe
} from 'lucide-react';
import { mockTransferForms } from '@/data/mockData';

const FormDetail = () => {
  const { id } = useParams<{ id: string }>();
  const form = mockTransferForms.find(f => f.id === id);
  
  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-2xl font-semibold mb-4">Form Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The form with ID {id} could not be found.
        </p>
        <Button asChild>
          <Link to="/transfer-forms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forms
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/transfer-forms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{form.title}</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Form Preview</CardTitle>
            <CardDescription>View and download this form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-md p-10 min-h-96 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">{form.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {form.fileType.toUpperCase()} document preview
                </p>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
            <CardDescription>Additional information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  Country
                </div>
                <p className="font-medium">{form.country}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Document Type
                </div>
                <p className="font-medium">{form.documentType}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Date Added
                </div>
                <p className="font-medium">{form.dateAdded}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  File Type
                </div>
                <p className="font-medium uppercase">{form.fileType}</p>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormDetail;
