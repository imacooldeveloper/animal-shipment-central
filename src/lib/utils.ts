
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ShipmentStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mapStatusToShipmentStatus = (status: string | null): ShipmentStatus => {
  if (!status) return 'draft';
  
  // Map common status values to ShipmentStatus
  if (status.toLowerCase().includes('draft') || 
      status.toLowerCase().includes('init') || 
      status === 'Initializing Import') {
    return 'draft';
  }
  
  if (status.toLowerCase().includes('progress') || 
      status.toLowerCase().includes('transit') || 
      status.toLowerCase().includes('waiting')) {
    return 'progress';
  }
  
  if (status.toLowerCase().includes('complete') || 
      status.toLowerCase().includes('delivered')) {
    return 'complete';
  }
  
  // Default fallback
  return 'draft';
};
