export interface BarData {
  value: number;
  isToday?: boolean;
}

export interface StatChip {
  label: string;
  value: string;
  color: string;
}

export type NavScreen = "home" | "history";
