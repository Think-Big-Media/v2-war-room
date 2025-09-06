import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { authCallback as authCallbackImpl0 } from "../../../../../google-ads/auth-callback";
import { authStart as authStartImpl1 } from "../../../../../google-ads/auth-start";
import { getInsights as getInsightsImpl2 } from "../../../../../google-ads/get-insights";
import { getPerformance as getPerformanceImpl3 } from "../../../../../google-ads/get-performance";
import { listCampaigns as listCampaignsImpl4 } from "../../../../../google-ads/list-campaigns";
import * as google_ads_service from "../../../../../google-ads/encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "google-ads",
            name:              "authCallback",
            handler:           authCallbackImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: google_ads_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "google-ads",
            name:              "authStart",
            handler:           authStartImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: google_ads_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "google-ads",
            name:              "getInsights",
            handler:           getInsightsImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: google_ads_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "google-ads",
            name:              "getPerformance",
            handler:           getPerformanceImpl3,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: google_ads_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "google-ads",
            name:              "listCampaigns",
            handler:           listCampaignsImpl4,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: google_ads_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
