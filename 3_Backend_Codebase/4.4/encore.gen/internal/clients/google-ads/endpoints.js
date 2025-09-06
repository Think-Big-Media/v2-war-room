import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";

const TEST_ENDPOINTS = typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test"
    ? await import("./endpoints_testing.js")
    : null;

export async function authCallback(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.authCallback(params, opts);
    }

    return apiCall("google-ads", "authCallback", params, opts);
}
export async function authStart(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.authStart(params, opts);
    }

    return apiCall("google-ads", "authStart", params, opts);
}
export async function getInsights(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.getInsights(params, opts);
    }

    return apiCall("google-ads", "getInsights", params, opts);
}
export async function getPerformance(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.getPerformance(params, opts);
    }

    return apiCall("google-ads", "getPerformance", params, opts);
}
export async function listCampaigns(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.listCampaigns(params, opts);
    }

    return apiCall("google-ads", "listCampaigns", params, opts);
}
