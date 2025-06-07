'use client';

import type { Report, ReportInput } from '@/types/report';
import type { ReactNode } from 'react';
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'reportCraftAiReports';

interface ReportState {
  reports: Report[];
  isLoading: boolean;
}

type ReportAction =
  | { type: 'LOAD_REPORTS'; payload: Report[] }
  | { type: 'ADD_REPORT'; payload: Report }
  | { type: 'EDIT_REPORT'; payload: Report }
  | { type: 'DELETE_REPORT'; payload: string }
  | { type: 'REORDER_REPORTS'; payload: Report[] };

const initialState: ReportState = {
  reports: [],
  isLoading: true,
};

const reportReducer = (state: ReportState, action: ReportAction): ReportState => {
  switch (action.type) {
    case 'LOAD_REPORTS':
      return { ...state, reports: action.payload, isLoading: false };
    case 'ADD_REPORT':
      return { ...state, reports: [action.payload, ...state.reports] };
    case 'EDIT_REPORT':
      return {
        ...state,
        reports: state.reports.map((report) =>
          report.id === action.payload.id ? action.payload : report
        ),
      };
    case 'DELETE_REPORT':
      return {
        ...state,
        reports: state.reports.filter((report) => report.id !== action.payload),
      };
    case 'REORDER_REPORTS':
      return { ...state, reports: action.payload };
    default:
      return state;
  }
};

interface ReportContextType extends ReportState {
  addReport: (reportData: ReportInput) => void;
  editReport: (reportData: Report) => void;
  deleteReport: (reportId: string) => void;
  reorderReports: (reports: Report[]) => void;
  getReportById: (reportId: string) => Report | undefined;
}

export const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reportReducer, initialState);

  useEffect(() => {
    try {
      const storedReports = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedReports) {
        dispatch({ type: 'LOAD_REPORTS', payload: JSON.parse(storedReports) });
      } else {
        dispatch({ type: 'LOAD_REPORTS', payload: [] });
      }
    } catch (error) {
      console.error("Failed to load reports from localStorage", error);
      dispatch({ type: 'LOAD_REPORTS', payload: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.isLoading) { // Only save if not initial loading phase
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.reports));
      } catch (error) {
        console.error("Failed to save reports to localStorage", error);
      }
    }
  }, [state.reports, state.isLoading]);

  const addReport = useCallback((reportData: ReportInput) => {
    const now = new Date().toISOString();
    const newReport: Report = {
      ...reportData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_REPORT', payload: newReport });
  }, []);

  const editReport = useCallback((reportData: Report) => {
    const updatedReport = { ...reportData, updatedAt: new Date().toISOString() };
    dispatch({ type: 'EDIT_REPORT', payload: updatedReport });
  }, []);

  const deleteReport = useCallback((reportId: string) => {
    dispatch({ type: 'DELETE_REPORT', payload: reportId });
  }, []);

  const reorderReports = useCallback((reports: Report[]) => {
    dispatch({ type: 'REORDER_REPORTS', payload: reports });
  }, []);
  
  const getReportById = useCallback((reportId: string): Report | undefined => {
    return state.reports.find(report => report.id === reportId);
  }, [state.reports]);

  return (
    <ReportContext.Provider value={{ ...state, addReport, editReport, deleteReport, reorderReports, getReportById }}>
      {children}
    </ReportContext.Provider>
  );
};
