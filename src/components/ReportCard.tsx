import type { Report } from '@/types/report';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ReportActions } from './ReportActions';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { summarizeReportContent } from '@/ai/flows/summarize-report-content';

interface ReportCardProps {
  report: Report;
  onEdit: (report: Report) => void;
  onDelete: (reportId: string) => void;
  onSummarize: (reportContent: string) => Promise<Awaited<ReturnType<typeof summarizeReportContent>> | { error: string }>;
}

export function ReportCard({ report, onEdit, onDelete, onSummarize }: ReportCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: report.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  const formattedDate = new Date(report.updatedAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Card ref={setNodeRef} style={style} className="mb-4 shadow-lg bg-card touch-manipulation">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="font-headline text-xl">{report.title}</CardTitle>
          <CardDescription>Last updated: {formattedDate}</CardDescription>
        </div>
        <button {...attributes} {...listeners} className="p-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground" aria-label="Drag to reorder">
          <GripVertical className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <p className="text-sm line-clamp-3 text-muted-foreground">{report.content || "No content yet."}</p>
      </CardContent>
      <CardFooter>
        <ReportActions
          report={report}
          onEdit={() => onEdit(report)}
          onDelete={() => onDelete(report.id)}
          onSummarize={onSummarize}
        />
      </CardFooter>
    </Card>
  );
}
