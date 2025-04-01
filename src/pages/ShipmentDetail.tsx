
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Check, 
  Download, 
  Eye, 
  FileText, 
  Pencil, 
  Plus, 
  Truck, 
  Upload 
} from 'lucide-react';
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';
import { mockShipments } from '@/data/mockData';
import { Shipment } from '@/types';

const ShipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const shipment = mockShipments.find(s => s.id === id);
  
  const [checklist, setChecklist] = useState(
    shipment?.checklist || {
      transferForms: false,
      healthCert: false,
      exportPermit: false,
      courier: false,
      pickupDate: false,
      packageReady: false,
    }
  );
  
  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-2xl font-semibold mb-4">Shipment Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The shipment with ID {id} could not be found.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }
  
  const updateChecklist = (key: keyof Shipment['checklist'], value: boolean) => {
    setChecklist(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const calculateProgress = () => {
    const totalItems = Object.keys(checklist).length;
    const completedItems = Object.values(checklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Shipment {shipment.id}</h1>
        <ShipmentStatusBadge status={shipment.status} className="ml-auto" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
            <CardDescription>View and manage shipment information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Country</p>
                    <p>{shipment.country}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="capitalize">{shipment.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Animal Type</p>
                    <p>{shipment.animalType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p>{shipment.lastUpdated}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Shipment Progress</h3>
                    <span className="text-sm text-muted-foreground">{calculateProgress()}% Complete</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Details
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Associated Documents</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </div>
                
                {shipment.documents.length === 0 ? (
                  <div className="text-center py-8 border rounded-md">
                    <p className="text-muted-foreground">No documents have been added yet.</p>
                    <Button className="mt-4" variant="outline">Upload Document</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {shipment.documents.map((doc) => (
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
              </TabsContent>
              
              <TabsContent value="timeline" className="space-y-4">
                <h3 className="text-lg font-medium">Shipment Timeline</h3>
                
                <div className="space-y-4">
                  {shipment.timeline.map((event, index) => (
                    <div key={event.id} className="relative pl-6">
                      {index !== shipment.timeline.length - 1 && (
                        <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-muted"></div>
                      )}
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary"></div>
                      <div className="space-y-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.timestamp}</p>
                        <p className="text-sm">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Coordinator Checklist</CardTitle>
            <CardDescription>Track shipment completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="transferForms" 
                  checked={checklist.transferForms}
                  onCheckedChange={(checked) => 
                    updateChecklist('transferForms', checked as boolean)
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="transferForms"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    Upload transfer forms
                    {checklist.transferForms && (
                      <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                        Complete
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Add all required forms for the destination country
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="healthCert" 
                  checked={checklist.healthCert}
                  onCheckedChange={(checked) => 
                    updateChecklist('healthCert', checked as boolean)
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="healthCert"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    Add health certificate
                    {checklist.healthCert && (
                      <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                        Complete
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Upload signed health certificate
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="exportPermit" 
                  checked={checklist.exportPermit}
                  onCheckedChange={(checked) => 
                    updateChecklist('exportPermit', checked as boolean)
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="exportPermit"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    Add export permit
                    {checklist.exportPermit && (
                      <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                        Complete
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Include approved export permit
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="courier" 
                  checked={checklist.courier}
                  onCheckedChange={(checked) => 
                    updateChecklist('courier', checked as boolean)
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="courier"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span>Assign courier</span>
                    {checklist.courier && (
                      <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                        Complete
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Book transportation service
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="pickupDate" 
                  checked={checklist.pickupDate}
                  onCheckedChange={(checked) => 
                    updateChecklist('pickupDate', checked as boolean)
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="pickupDate"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span>Confirm pickup date</span>
                    {checklist.pickupDate && (
                      <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                        Complete
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Schedule collection time
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="packageReady" 
                  checked={checklist.packageReady}
                  onCheckedChange={(checked) => 
                    updateChecklist('packageReady', checked as boolean)
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="packageReady"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    Final package ready
                    {checklist.packageReady && (
                      <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                        Complete
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Complete final packaging
                  </p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Checklist Status</p>
                <p className="text-sm text-muted-foreground">
                  {calculateProgress()}% Complete
                </p>
              </div>
              <Button className="gap-2">
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShipmentDetail;
