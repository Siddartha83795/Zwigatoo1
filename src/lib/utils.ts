import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


/** Minimal ClassValue type compatible with clsx */
export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: any }
  | ClassValue[];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

