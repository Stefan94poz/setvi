'use client';

import { ReportContext } from '@/contexts/ReportProvider';
import { useContext } from 'react';

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
