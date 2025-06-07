import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { generateReportDraft as generateReportDraftFlow } from '@/ai/flows/generate-report-draft';
import { useToast } from '@/hooks/use-toast';

interface GenerateDraftDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDraftGenerated: (draft: string) => void;
}

export function GenerateDraftDialog({ isOpen, onOpenChange, onDraftGenerated }: GenerateDraftDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt Required',
        description: 'Please enter a prompt to generate a draft.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await generateReportDraftFlow({ prompt });
      onDraftGenerated(result.reportDraft);
      toast({
        title: 'Draft Generated',
        description: 'The AI has generated a draft for your report.',
      });
      setPrompt(''); // Clear prompt after successful generation
      onOpenChange(false);
    } catch (error) {
      console.error('Draft generation error:', error);
      toast({
        variant: 'destructive',
        title: 'Draft Generation Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Generate Report Draft</DialogTitle>
          <DialogDescription>
            Enter a prompt for the AI to generate a draft for your report content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="prompt" className="text-left">
              Prompt
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Write an analysis of Q3 sales performance..."
              className="col-span-3 min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={isLoading || !prompt.trim()}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
