
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText, Plus, Search } from 'lucide-react';
import { countries, animalTypes, documentTypes, mockTransferForms } from '@/data/mockData';
import { Link } from 'react-router-dom';

const TransferForms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [animalTypeFilter, setAnimalTypeFilter] = useState('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');

  const filteredForms = mockTransferForms.filter(form => {
    const matchesSearch = searchTerm === '' || 
      form.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = countryFilter === 'all' || form.country === countryFilter;
    const matchesAnimalType = animalTypeFilter === 'all' || form.animalType === animalTypeFilter;
    const matchesDocumentType = documentTypeFilter === 'all' || form.documentType === documentTypeFilter;
    
    return matchesSearch && matchesCountry && matchesAnimalType && matchesDocumentType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transfer Forms Database</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload New Form
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Country-Specific Forms</CardTitle>
          <CardDescription>
            Browse and download required forms for animal imports and exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search form titles..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={countryFilter}
              onValueChange={setCountryFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={animalTypeFilter}
              onValueChange={setAnimalTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by animal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Animals</SelectItem>
                {animalTypes.map(animal => (
                  <SelectItem key={animal} value={animal}>{animal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={documentTypeFilter}
              onValueChange={setDocumentTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Document Types</SelectItem>
                {documentTypes.map(docType => (
                  <SelectItem key={docType} value={docType}>{docType}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Animal Type</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No forms found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.title}</TableCell>
                      <TableCell>{form.country}</TableCell>
                      <TableCell>{form.animalType}</TableCell>
                      <TableCell>{form.documentType}</TableCell>
                      <TableCell>{form.dateAdded}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/transfer-forms/${form.id}`}>
                              <FileText className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferForms;
