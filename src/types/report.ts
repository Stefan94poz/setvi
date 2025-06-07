export interface Report {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type ReportInput = Omit<Report, 'id' | 'createdAt' | 'updatedAt'>;
