import type { Report } from '@/types/report';
import { ReportCard } from './ReportCard';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { summarizeReportContent as summarizeReportContentFlow } from '@/ai/flows/summarize-report-content';

interface ReportListProps {
  reports: Report[];
  onEdit: (report: Report) => void;
  onDelete: (reportId: string) => void;
  onReorder: (reports: Report[]) => void;
}

export function ReportList({ reports, onEdit, onDelete, onReorder }: ReportListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require pointer to move 8px before activating drag
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = reports.findIndex((report) => report.id === active.id);
      const newIndex = reports.findIndex((report) => report.id === over.id);
      onReorder(arrayMove(reports, oldIndex, newIndex));
    }
  };

  const handleSummarize = async (reportContent: string) => {
    try {
      const result = await summarizeReportContentFlow({ reportContent });
      return result;
    } catch (error) {
      console.error('Summarization error:', error);
      return { error: error instanceof Error ? error.message : 'An unknown error occurred during summarization.' };
    }
  };

  if (reports.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No reports yet. Create one to get started!</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={reports.map(report => report.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onEdit={onEdit}
              onDelete={onDelete}
              onSummarize={handleSummarize}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
