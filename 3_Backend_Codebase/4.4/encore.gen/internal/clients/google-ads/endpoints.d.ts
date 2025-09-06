import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { authCallback as authCallback_handler } from "../../../../google-ads/auth-callback.js";
declare const authCallback: WithCallOpts<typeof authCallback_handler>;
export { authCallback };

import { authStart as authStart_handler } from "../../../../google-ads/auth-start.js";
declare const authStart: WithCallOpts<typeof authStart_handler>;
export { authStart };

import { getInsights as getInsights_handler } from "../../../../google-ads/get-insights.js";
declare const getInsights: WithCallOpts<typeof getInsights_handler>;
export { getInsights };

import { getPerformance as getPerformance_handler } from "../../../../google-ads/get-performance.js";
declare const getPerformance: WithCallOpts<typeof getPerformance_handler>;
export { getPerformance };

import { listCampaigns as listCampaigns_handler } from "../../../../google-ads/list-campaigns.js";
declare const listCampaigns: WithCallOpts<typeof listCampaigns_handler>;
export { listCampaigns };


