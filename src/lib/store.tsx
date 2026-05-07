'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, Capture, LSATSession, Workout, WritingNote, Person } from './types';
import { MOCK_DATA } from './mock-data';

type Action =
  | { type: 'ADD_CAPTURE'; payload: Capture }
  | { type: 'UPDATE_CAPTURE'; payload: Capture }
  | { type: 'DELETE_CAPTURE'; payload: string }
  | { type: 'ADD_LSAT_SESSION'; payload: LSATSession }
  | { type: 'DELETE_LSAT_SESSION'; payload: string }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'ADD_WRITING_NOTE'; payload: WritingNote }
  | { type: 'UPDATE_WRITING_NOTE'; payload: WritingNote }
  | { type: 'DELETE_WRITING_NOTE'; payload: string }
  | { type: 'ADD_PERSON'; payload: Person }
  | { type: 'UPDATE_PERSON'; payload: Person }
  | { type: 'DELETE_PERSON'; payload: string }
  | { type: 'HYDRATE'; payload: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'ADD_CAPTURE':
      return { ...state, captures: [action.payload, ...state.captures] };
    case 'UPDATE_CAPTURE':
      return {
        ...state,
        captures: state.captures.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CAPTURE':
      return { ...state, captures: state.captures.filter((c) => c.id !== action.payload) };
    case 'ADD_LSAT_SESSION':
      return { ...state, lsatSessions: [action.payload, ...state.lsatSessions] };
    case 'DELETE_LSAT_SESSION':
      return {
        ...state,
        lsatSessions: state.lsatSessions.filter((s) => s.id !== action.payload),
      };
    case 'ADD_WORKOUT':
      return { ...state, workouts: [action.payload, ...state.workouts] };
    case 'DELETE_WORKOUT':
      return { ...state, workouts: state.workouts.filter((w) => w.id !== action.payload) };
    case 'ADD_WRITING_NOTE':
      return { ...state, writingNotes: [action.payload, ...state.writingNotes] };
    case 'UPDATE_WRITING_NOTE':
      return {
        ...state,
        writingNotes: state.writingNotes.map((n) =>
          n.id === action.payload.id ? action.payload : n
        ),
      };
    case 'DELETE_WRITING_NOTE':
      return {
        ...state,
        writingNotes: state.writingNotes.filter((n) => n.id !== action.payload),
      };
    case 'ADD_PERSON':
      return { ...state, people: [action.payload, ...state.people] };
    case 'UPDATE_PERSON':
      return {
        ...state,
        people: state.people.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PERSON':
      return { ...state, people: state.people.filter((p) => p.id !== action.payload) };
    default:
      return state;
  }
}

const STORAGE_KEY = 'life-os-data';

interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, MOCK_DATA);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function nanoid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
