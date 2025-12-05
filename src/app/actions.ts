'use server';

import { predictWaitTime as predictWaitTimeFlow } from '@/ai/flows/intelligent-wait-time-prediction';
import type { PredictWaitTimeInput } from '@/ai/flows/intelligent-wait-time-prediction';

export async function predictWaitTime(input: PredictWaitTimeInput) {
  try {
    const result = await predictWaitTimeFlow(input);
    return { success: true, data: result };
  } catch(error) {
    console.error("AI prediction failed:", error);
    return { success: false, error: "Failed to get an AI prediction."};
  }
}
