
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Plus } from 'lucide-react';
import { mockMessageTemplates } from '@/data/mockData';

const Templates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState(mockMessageTemplates);
  const [previewData, setPreviewData] = useState<Record<string, Record<string, string>>>({});

  const copyToClipboard = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    let content = template.content;
    const templatePreviewData = previewData[templateId] || {};
    
    // Replace variables with preview values if available
    template.variables.forEach(variable => {
      const value = templatePreviewData[variable] || `[${variable}]`;
      content = content.replace(new RegExp(`\\[${variable}\\]`, 'g'), value);
    });

    navigator.clipboard.writeText(content)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Message template has been copied",
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy the template to clipboard",
        });
      });
  };

  const updatePreviewData = (templateId: string, variable: string, value: string) => {
    setPreviewData(prev => ({
      ...prev,
      [templateId]: {
        ...(prev[templateId] || {}),
        [variable]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Message Templates</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
          <CardDescription>
            Customize and copy message templates for common communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {templates.map((template) => (
              <AccordionItem key={template.id} value={template.id}>
                <AccordionTrigger className="text-lg font-medium">
                  {template.title}
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                    {template.content}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Replace Variables:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {template.variables.map(variable => (
                        <div key={variable} className="space-y-2">
                          <Label htmlFor={`${template.id}-${variable}`}>{variable}</Label>
                          <Input 
                            id={`${template.id}-${variable}`}
                            placeholder={`Enter ${variable.toLowerCase()}`}
                            value={(previewData[template.id]?.[variable] || '')}
                            onChange={(e) => updatePreviewData(template.id, variable, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Preview:</h4>
                    <div className="bg-white border rounded-md p-4 whitespace-pre-wrap">
                      {template.content.split('\n').map((line, idx) => {
                        let processedLine = line;
                        template.variables.forEach(variable => {
                          const value = previewData[template.id]?.[variable] || `[${variable}]`;
                          processedLine = processedLine.replace(
                            new RegExp(`\\[${variable}\\]`, 'g'), 
                            value
                          );
                        });
                        return <p key={idx}>{processedLine}</p>;
                      })}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => copyToClipboard(template.id)}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Templates;
