import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
interface LogEntry {
  entity: string;
  action: 'update' | 'delete';
  oldValue?: any;
  newValue?: any;
  model_id: number;
}

export async function logAction({ entity, action, oldValue, newValue, model_id }: LogEntry) {
  const session = await getServerSession(authOptions);
  try {

    // Compute differences
    const diff_raw = getDifferences(oldValue, newValue);


    // Convert differences to JSON
    const differences = JSON.stringify(diff_raw);

    console.log(JSON.stringify(diff_raw))
    // Check if there are significant differences
    if (diff_raw && diff_raw.length > 0) {
      // Create log entry in the database
      const newLog = await prisma.log.create({
        data: {
          entity: entity,
          action: action,
          newValue: differences,
          model_id: model_id,
          userId: session?.user.id
        }
      });

      // Log action
      console.log(`Logged ${action} ${diff_raw.length} action(s) on ${entity} ${model_id}: ${differences}`);
    }
  } catch (error) {
    console.error('Failed to log action:', error);
  }

}

interface Diffable {
  [key: string]: any;
}



function getDifferences(oldObj: Diffable, newObj: Diffable) {
  const differencesArray: { field: string, oldValue: any, newValue: any }[] = [];
  for (const key in oldObj) {
    if (Object.prototype.hasOwnProperty.call(oldObj, key)) {
      const oldValue = (oldObj[key]);
      const newValue = (newObj[key]);
      const oldValueString = oldValue !== undefined ? String(oldValue) : '';
      const newValueString = newValue !== undefined ? String(newValue) : '';

      if ((oldValueString.trim() !== newValueString.trim()) && key !== 'updatedAt') {
        differencesArray.push({
          field: key,
          oldValue: oldValue,
          newValue: newValue
        });
      }
    }
  }

  return differencesArray;
}

