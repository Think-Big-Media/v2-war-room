import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as google_ads_service from "../../../../google-ads/encore.service";

export async function authCallback(params, opts) {
    const handler = (await import("../../../../google-ads/auth-callback")).authCallback;
    registerTestHandler({
        apiRoute: { service: "google-ads", name: "authCallback", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: google_ads_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("google-ads", "authCallback", params, opts);
}

export async function authStart(params, opts) {
    const handler = (await import("../../../../google-ads/auth-start")).authStart;
    registerTestHandler({
        apiRoute: { service: "google-ads", name: "authStart", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: google_ads_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("google-ads", "authStart", params, opts);
}

export async function getInsights(params, opts) {
    const handler = (await import("../../../../google-ads/get-insights")).getInsights;
    registerTestHandler({
        apiRoute: { service: "google-ads", name: "getInsights", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: google_ads_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("google-ads", "getInsights", params, opts);
}

export async function getPerformance(params, opts) {
    const handler = (await import("../../../../google-ads/get-performance")).getPerformance;
    registerTestHandler({
        apiRoute: { service: "google-ads", name: "getPerformance", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: google_ads_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("google-ads", "getPerformance", params, opts);
}

export async function listCampaigns(params, opts) {
    const handler = (await import("../../../../google-ads/list-campaigns")).listCampaigns;
    registerTestHandler({
        apiRoute: { service: "google-ads", name: "listCampaigns", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: google_ads_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("google-ads", "listCampaigns", params, opts);
}

