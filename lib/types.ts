// lib/types.ts

export interface Point {
  x: number;
  y: number;
}

export interface TodoLink {
  id: string;
  url: string;
  label: string;
  type: 'external' | 'local';
}

export interface TodoCardType {
  id: string;
  brief: string;
  notes: string;
  links: TodoLink[];
  position: Point;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  cards: TodoCardType[];
  camera: {
    position: Point;
    zoom: number;
  };
  theme: 'light' | 'dark';
  orbitMode: boolean;
}