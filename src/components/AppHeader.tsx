import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { PlusCircle, Search } from 'lucide-react';

interface AppHeaderProps {
  onSearchChange: (searchTerm: string) => void;
  onCreateReport: () => void;
  searchTerm: string;
}

export function AppHeader({ onSearchChange, onCreateReport, searchTerm }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b py-4 px-4 md:px-6 mb-6">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-primary">ReportCraft AI</h1>
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
          <Button onClick={onCreateReport} className="whitespace-nowrap">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Report
          </Button>
        </div>
      </div>
    </header>
  );
}
