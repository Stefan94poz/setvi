import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Activity {
  name: string;
  timestamp: string;
}

interface ActivityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityDialog({ isOpen, onOpenChange }: ActivityDialogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);

  // Fetch activities from current user in localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setActivities(user.activity || []);
      } catch {
        setActivities([]);
      }
    } else {
      setActivities([]);
    }
  }, [isOpen]);

  // Pagination logic
  const pageSize = 5;
  const totalPages = Math.ceil(activities.length / pageSize);
  const paginated = activities.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline">Activity Log</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto flex-grow">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Activity</th>
                <th className="px-4 py-2 border-b">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-2 text-center">
                    No activities found.
                  </td>
                </tr>
              ) : (
                paginated.map((activity, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border-b">{activity.name}</td>
                    <td className="px-4 py-2 border-b">{activity.timestamp}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center ">
          {totalPages > 1 && (
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2 mt-2"
            onClick={() => {
              // Clear all activities for current user
              const userData = localStorage.getItem("userData");
              if (userData) {
                try {
                  const user = JSON.parse(userData);
                  user.activity = [];
                  localStorage.setItem("userData", JSON.stringify(user));
                  setActivities([]);
                } catch {}
              }
            }}
          >
            Clear All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
