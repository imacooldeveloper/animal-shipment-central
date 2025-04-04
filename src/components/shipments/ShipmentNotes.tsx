
import { useState, useEffect } from 'react';
import { FileText, Send, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ShipmentNote } from '@/types';
import { parseNotesData, formatNoteDate } from '@/lib/note-utils';

interface ShipmentNotesProps {
  shipmentId: string;
  shipmentType: 'import' | 'export';
  existingNotes: ShipmentNote[] | string | null;
}

const ShipmentNotes = ({ shipmentId, shipmentType, existingNotes = [] }: ShipmentNotesProps) => {
  // Use the utility function to parse notes
  const [notes, setNotes] = useState<ShipmentNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Initialize notes from props
  useEffect(() => {
    console.log(`Initializing notes for ${shipmentType} ${shipmentId}`, existingNotes);
    const parsedNotes = parseNotesData(existingNotes);
    setNotes(parsedNotes);
  }, [existingNotes, shipmentId, shipmentType]);

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
      
      console.log(`Adding new note to ${shipmentType} ${shipmentId}`, updatedNotes);
      
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
                      {formatNoteDate(note.created_at)}
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
