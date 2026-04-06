"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from "react";
import { WatchItem, WatchStatus } from "@/types";
import { seedData } from "@/data/seed";

type Action =
  | { type: "ADD_ITEM"; payload: Omit<WatchItem, "id" | "addedAt" | "updatedAt"> }
  | { type: "UPDATE_STATUS"; payload: { id: string; status: WatchStatus } }
  | { type: "SET_RATING"; payload: { id: string; rating: number } }
  | { type: "SET_REVIEW"; payload: { id: string; review: string } }
  | { type: "DELETE_ITEM"; payload: { id: string } };

interface WatchlistState {
  items: WatchItem[];
}

interface WatchlistContextValue extends WatchlistState {
  dispatch: React.Dispatch<Action>;
  addItem: (item: Omit<WatchItem, "id" | "addedAt" | "updatedAt">) => void;
  updateStatus: (id: string, status: WatchStatus) => void;
  setRating: (id: string, rating: number) => void;
  setReview: (id: string, review: string) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => WatchItem | undefined;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

let nextId = 100;

function watchlistReducer(state: WatchlistState, action: Action): WatchlistState {
  const now = new Date().toISOString();

  switch (action.type) {
    case "ADD_ITEM":
      return {
        items: [
          ...state.items,
          {
            ...action.payload,
            id: String(nextId++),
            addedAt: now,
            updatedAt: now,
          },
        ],
      };
    case "UPDATE_STATUS":
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, status: action.payload.status, updatedAt: now }
            : item
        ),
      };
    case "SET_RATING":
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, rating: action.payload.rating, updatedAt: now }
            : item
        ),
      };
    case "SET_REVIEW":
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, review: action.payload.review, updatedAt: now }
            : item
        ),
      };
    case "DELETE_ITEM":
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    default:
      return state;
  }
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(watchlistReducer, {
    items: seedData,
  });

  const addItem = (item: Omit<WatchItem, "id" | "addedAt" | "updatedAt">) =>
    dispatch({ type: "ADD_ITEM", payload: item });

  const updateStatus = (id: string, status: WatchStatus) =>
    dispatch({ type: "UPDATE_STATUS", payload: { id, status } });

  const setRating = (id: string, rating: number) =>
    dispatch({ type: "SET_RATING", payload: { id, rating } });

  const setReview = (id: string, review: string) =>
    dispatch({ type: "SET_REVIEW", payload: { id, review } });

  const deleteItem = (id: string) =>
    dispatch({ type: "DELETE_ITEM", payload: { id } });

  const getItem = (id: string) => state.items.find((item) => item.id === id);

  return (
    <WatchlistContext.Provider
      value={{
        ...state,
        dispatch,
        addItem,
        updateStatus,
        setRating,
        setReview,
        deleteItem,
        getItem,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
