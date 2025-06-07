import type { Report, ReportInput } from '@/types/report';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { GenerateDraftDialog } from './GenerateDraftDialog';
import { useToast } from '@/hooks/use-toast';

interface ReportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (reportData: ReportInput | Report) => void;
  reportToEdit?: Report | null;
}

export function ReportDialog({ isOpen, onOpenChange, onSave, reportToEdit }: ReportDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerateDraftOpen, setIsGenerateDraftOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (reportToEdit && isOpen) {
      setTitle(reportToEdit.title);
      setContent(reportToEdit.content);
    } else if (!isOpen) { // Reset form when dialog closes and not editing
      setTitle('');
      setContent('');
    }
  }, [reportToEdit, isOpen]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Title Required',
        description: 'Please enter a title for the report.',
      });
      return;
    }
    setIsSaving(true);
    const reportData = { title, content };
    
    if (reportToEdit) {
      onSave({ ...reportToEdit, ...reportData });
    } else {
      onSave(reportData);
    }
    // onOpenChange(false); // Closing is handled by parent or onSave success
    // Resetting state is handled by useEffect or parent
    setIsSaving(false);
  };

  const handleDraftGenerated = (draft: string) => {
    setContent(draft);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) { // Explicitly clear form on close if not handled by useEffect due to reportToEdit
          setTitle('');
          setContent('');
        }
      }}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-headline">
              {reportToEdit ? 'Edit Report' : 'Create New Report'}
            </DialogTitle>
            <DialogDescription>
              {reportToEdit ? 'Update the details of your report.' : 'Fill in the details to create a new report.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                disabled={isSaving}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">
                Content
              </Label>
              <div className="col-span-3 space-y-2">
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your report content here... or use AI to generate a draft."
                  className="min-h-[200px] resize-y"
                  disabled={isSaving}
                />
                {/* Placeholder for Rich Text Editor: TinyMCE or similar should be integrated here */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsGenerateDraftOpen(true)}
                  disabled={isSaving}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Draft with AI
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSave} disabled={isSaving || !title.trim()}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {reportToEdit ? 'Save Changes' : 'Create Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <GenerateDraftDialog
        isOpen={isGenerateDraftOpen}
        onOpenChange={setIsGenerateDraftOpen}
        onDraftGenerated={handleDraftGenerated}
      />
    </>
  );
}
