import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ isOpen, onOpenChange }: LoginDialogProps) {
  // Handler for setting admin user
  const handleAdmin = () => {
    localStorage.removeItem("userData");
    localStorage.setItem(
      "userData",
      JSON.stringify({ name: "admin", role: "admin", email: "", activity: [] })
    );
    onOpenChange(false);
    window.location.reload();
  };

  // Handler for setting viewer user
  const handleViewer = () => {
    localStorage.removeItem("userData");
    localStorage.setItem(
      "userData",
      JSON.stringify({
        name: "viewer",
        role: "viewer",
        activity: [],
      })
    );
    onOpenChange(false);
    window.location.reload();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-headline">Login</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 flex-grow overflow-y-auto pr-2">
            <Button type="button" onClick={handleAdmin}>
              Admin
            </Button>
            <Button type="button" onClick={handleViewer}>
              Viewer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
