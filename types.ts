export interface Prize {
  id: string;
  label: string;
  shortLabel: string; // For the wheel segment
  color: string;
  textColor: string;
  weight: number; // For probability (higher = more likely)
}

export interface UserData {
  name: string;
  phone: string;
  city: string;
  businessType: string;
}

export interface Lead extends UserData {
  id: string;
  prize: string;
  timestamp: number;
  // CRM Fields
  source?: string;
  status?: string;
  probability?: number;
  assigned_to?: string;
}

export enum GameState {
  LANDING = 'LANDING',
  FORM = 'FORM',
  SPINNING = 'SPINNING',
  RESULT = 'RESULT',
  DASHBOARD = 'DASHBOARD'
}

export interface WheelSegmentProps {
  label: string;
  color: string;
  textColor: string;
  angle: number; // Angle size of the slice
  rotation: number; // Starting rotation
  radius: number;
}