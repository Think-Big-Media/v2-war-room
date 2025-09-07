import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const dataMode = secret("DATA_MODE");

interface HealthResponse {
  status: string;
  data_mode: string;
}

// Returns the health status of the application with current data mode.
export const health = api<void, HealthResponse>(
  { expose: true, method: "GET", path: "/api/v1/health" },
  async () => {
    return {
      status: "ok",
      data_mode: dataMode() || "MOCK"
    };
  }
);
