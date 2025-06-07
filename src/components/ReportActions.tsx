import type { Report } from '@/types/report';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, MessageSquareText, Loader2 } from 'lucide-react';
import type { summarizeReportContent } from '@/ai/flows/summarize-report-content'; // Only type import
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ReportActionsProps {
  report: Report;
  onEdit: () => void;
  onDelete: () => void;
  onSummarize: (reportContent: string) => Promise<Awaited<ReturnType<typeof summarizeReportContent>> | { error: string }>;
}

export function ReportActions({ report, onEdit, onDelete, onSummarize }: ReportActionsProps) {
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await onSummarize(report.content);
    setIsSummarizing(false);
    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: result.error,
      });
    } else {
      toast({
        title: 'Content Summarized',
        description: (
            <div className="max-h-48 overflow-y-auto">
              <p className="font-semibold">Summary:</p>
              <p>{result.summary}</p>
            </div>
        ),
        duration: 15000, 
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" onClick={onEdit} aria-label="Edit report">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleSummarize} disabled={isSummarizing || !report.content.trim()} aria-label="Summarize report">
        {isSummarizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquareText className="h-4 w-4" />}
      </Button>
      <Button variant="destructive" size="icon" onClick={onDelete} aria-label="Delete report">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
