import { useState } from 'react';
import { FileText, Send, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ShipmentNote } from '@/types';

interface ShipmentNotesProps {
  shipmentId: string;
  shipmentType: 'import' | 'export';
  existingNotes: ShipmentNote[] | string | null;
}

const ShipmentNotes = ({ shipmentId, shipmentType, existingNotes = [] }: ShipmentNotesProps) => {
  // Parse notes if they are a string, otherwise use them as is
  const parsedInitialNotes = parseNotes(existingNotes);
  
  const [notes, setNotes] = useState<ShipmentNote[]>(parsedInitialNotes);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Helper function to safely parse notes - fixed to avoid type recursion
  function parseNotes(notesInput: ShipmentNote[] | string | null): ShipmentNote[] {
    if (!notesInput) return [];
    
    if (Array.isArray(notesInput)) {
      return notesInput;
    }
    
    // Handle string type notes
    if (typeof notesInput === 'string') {
      try {
        const parsed = JSON.parse(notesInput);
        if (Array.isArray(parsed)) {
          return parsed;
        } else {
          // If parsing succeeded but didn't produce an array
          return [{
            id: crypto.randomUUID(),
            content: notesInput,
            created_at: new Date().toISOString(),
            user_name: 'User'
          }];
        }
      } catch (e) {
        // If JSON parsing fails, treat as a single note
        return [{
          id: crypto.randomUUID(),
          content: notesInput,
          created_at: new Date().toISOString(),
          user_name: 'User'
        }];
      }
    }
    
    // Default fallback for any other case
    return [];
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setSubmitting(true);
    
    try {
      // The table name to update based on the shipment type
      const tableName = shipmentType === 'import' ? 'imports' : 'exports';
      const idField = shipmentType === 'import' ? 'import_number' : 'export_number';
      
      // Create a new note object
      const noteObj: ShipmentNote = {
        id: crypto.randomUUID(),
        content: newNote,
        created_at: new Date().toISOString(),
        user_name: 'Current User' // Replace with actual user name if you have authentication
      };
      
      // We'll store all notes as a JSON string in the notes field
      const updatedNotes = [...notes, noteObj];
      
      // Update the database
      const { error } = await supabase
        .from(tableName)
        .update({ 
          notes: JSON.stringify(updatedNotes) 
        })
        .eq(idField, shipmentId);
      
      if (error) throw error;
      
      // Update local state
      setNotes(updatedNotes);
      setNewNote('');
      toast.success('Note added successfully');
      
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error(`Failed to add note: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Notes & Updates</CardTitle>
        <CardDescription>
          Add notes to keep track of important updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="bg-muted/50 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="font-medium text-sm">
                        {note.user_name || 'User'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(note.created_at)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No notes have been added yet</p>
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <label htmlFor="new-note" className="text-sm font-medium">
              Add a new note
            </label>
            <Textarea
              id="new-note"
              placeholder="Enter a note about this shipment..."
              className="min-h-[100px]"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddNote} 
                disabled={!newNote.trim() || submitting}
                className="mt-2"
              >
                <Send className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentNotes;
