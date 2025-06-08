import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { PlusCircle, Search } from "lucide-react";
import { DropDownAvatar } from "./DropDownAvatar";

interface AppHeaderProps {
  onSearchChange: (searchTerm: string) => void;
  onCreateReport: () => void;
  handleLogin: () => void;
  handleActivity: () => void;
  searchTerm: string;
}

interface User {
  name: string;
  role: string;
}
export function AppHeader({
  onSearchChange,
  onCreateReport,
  handleLogin,
  handleActivity,
  searchTerm,
}: AppHeaderProps) {
  const user: User | null = (() => {
    const data = localStorage.getItem("userData");
    try {
      return data ? (JSON.parse(data) as User) : null;
    } catch {
      return null;
    }
  })();

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b py-4 px-4 md:px-6 mb-6">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-primary">
            ReportCraft AI
          </h1>
        </div>
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reports by title..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {user?.name ? (
            <>
              {user.role === "admin" && (
                <Button onClick={onCreateReport} className="whitespace-nowrap">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Report
                </Button>
              )}

              <DropDownAvatar handleActivity={handleActivity} />
            </>
          ) : (
            <Button
              onClick={handleLogin}
              className="whitespace-nowrap ml-4"
              variant="secondary"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
