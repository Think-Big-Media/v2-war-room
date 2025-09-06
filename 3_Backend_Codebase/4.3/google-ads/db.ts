import { SQLDatabase } from "encore.dev/storage/sqldb";

export const googleAdsDB = new SQLDatabase("google_ads", {
  migrations: "./migrations",
});
