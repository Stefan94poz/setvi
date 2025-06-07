'use client';

import { useState, useMemo } from 'react';
import { useReports } from '@/hooks/useReports';
import type { Report, ReportInput } from '@/types/report';
import { ReportList } from './ReportList';
import { ReportDialog } from './ReportDialog';
import { AppHeader } from './AppHeader';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

export function ReportDashboard() {
  const { reports, addReport, editReport, deleteReport: deleteReportFromContext, reorderReports, isLoading, getReportById } = useReports();
  const { toast } = useToast();

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportToEdit, setReportToEdit] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reportToDeleteId, setReportToDeleteId] = useState<string | null>(null);


  const filteredReports = useMemo(() => {
    if (!searchTerm) return reports;
    return reports.filter((report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  const handleCreateReport = () => {
    setReportToEdit(null);
    setIsReportDialogOpen(true);
  };

  const handleEditReport = (report: Report) => {
    setReportToEdit(report);
    setIsReportDialogOpen(true);
  };

  const handleDeleteReport = (reportId: string) => {
    setReportToDeleteId(reportId);
  };

  const confirmDeleteReport = () => {
    if (reportToDeleteId) {
      deleteReportFromContext(reportToDeleteId);
      toast({ title: 'Report Deleted', description: 'The report has been successfully deleted.' });
      setReportToDeleteId(null);
    }
  };

  const handleSaveReport = (reportData: ReportInput | Report) => {
    if ('id' in reportData) { // Editing existing report
      editReport(reportData as Report);
      toast({ title: 'Report Updated', description: 'Your report has been successfully updated.' });
    } else { // Creating new report
      addReport(reportData as ReportInput);
      toast({ title: 'Report Created', description: 'A new report has been successfully created.' });
    }
    setIsReportDialogOpen(false);
    setReportToEdit(null); // Clear editing state
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
         <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b py-4 px-4 md:px-6 mb-6">
            <div className="container mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-7 w-40" />
                </div>
                <div className="flex items-center gap-4 flex-1 max-w-md">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateReport={handleCreateReport}
      />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <ReportList
          reports={filteredReports}
          onEdit={handleEditReport}
          onDelete={handleDeleteReport}
          onReorder={reorderReports}
        />
      </main>
      <ReportDialog
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        onSave={handleSaveReport}
        reportToEdit={reportToEdit}
      />
      <AlertDialog open={!!reportToDeleteId} onOpenChange={(open) => !open && setReportToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the report titled &quot;{reportToDeleteId ? getReportById(reportToDeleteId)?.title : ''}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReportToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteReport}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="p-4 border rounded-lg shadow-lg bg-card">
      <div className="flex items-start justify-between pb-2">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex space-x-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  );
}
