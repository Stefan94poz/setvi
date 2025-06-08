import type { Report } from "@/types/report";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  MessageSquareText,
  Loader2,
  PlusCircle,
} from "lucide-react";
import type { summarizeReportContent } from "@/ai/flows/summarize-report-content"; // Only type import
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ReportActionsProps {
  report: Report;
  onEdit: () => void;
  onDelete: () => void;
  onSummarize: (
    reportContent: string
  ) => Promise<
    Awaited<ReturnType<typeof summarizeReportContent>> | { error: string }
  >;
  onCreate?: () => void; // Optional: pass this if you want to show create
}

function addActivity(name: string) {
  const userData = localStorage.getItem("userData");
  if (!userData) return;
  try {
    const user = JSON.parse(userData);
    const activity = {
      name,
      timestamp: new Date().toLocaleString(),
    };
    user.activity = Array.isArray(user.activity) ? user.activity : [];
    user.activity.unshift(activity); // add to start
    localStorage.setItem("userData", JSON.stringify(user));
  } catch {}
}

export function ReportActions({
  report,
  onEdit,
  onDelete,
  onSummarize,
  onCreate,
}: ReportActionsProps) {
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Get user from localStorage
  let user: { role?: string } = {};
  try {
    const userData = localStorage.getItem("userData");
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch {}

  const isAdmin = user.role === "admin";

  const handleSummarize = async () => {
    addActivity("summarize report");
    setIsSummarizing(true);
    const result = await onSummarize(report.content);
    setIsSummarizing(false);
    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: result.error,
      });
    } else {
      toast({
        title: "Content Summarized",
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

  const handleEdit = () => {
    addActivity("Edit report");
    onEdit();
  };

  const handleDelete = () => {
    addActivity("Delete report");
    onDelete();
  };

  const handleCreate = () => {
    addActivity("Create report");
    onCreate?.();
  };

  return (
    <div className="flex space-x-2">
      {isAdmin && onCreate && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleCreate}
          aria-label="Create report"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      )}
      {isAdmin && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleEdit}
          aria-label="Edit report"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={handleSummarize}
        disabled={isSummarizing || !report.content.trim()}
        aria-label="Summarize report"
      >
        {isSummarizing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MessageSquareText className="h-4 w-4" />
        )}
      </Button>
      {isAdmin && (
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          aria-label="Delete report"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
