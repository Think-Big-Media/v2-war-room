import { api } from "encore.dev/api";

// Crisis alerts endpoint
export const getCrisisAlerts = api(
  { expose: true, method: "GET", path: "/api/v1/mentionlytics/mentions/crisis" },
  async (): Promise<{ alerts: any[] }> => {
    // Return empty alerts for now - can be enhanced later
    return { 
      alerts: [] 
    };
  }
);