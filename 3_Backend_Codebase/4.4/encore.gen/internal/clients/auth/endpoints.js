import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";

const TEST_ENDPOINTS = typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test"
    ? await import("./endpoints_testing.js")
    : null;

export async function googleLogin(opts) {
    const params = undefined;
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.googleLogin(params, opts);
    }

    return apiCall("auth", "googleLogin", params, opts);
}
export async function googleCallback(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.googleCallback(params, opts);
    }

    return apiCall("auth", "googleCallback", params, opts);
}
export async function login(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.login(params, opts);
    }

    return apiCall("auth", "login", params, opts);
}
export async function refresh(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.refresh(params, opts);
    }

    return apiCall("auth", "refresh", params, opts);
}
export async function register(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.register(params, opts);
    }

    return apiCall("auth", "register", params, opts);
}
export async function getCurrentUser(opts) {
    const params = undefined;
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.getCurrentUser(params, opts);
    }

    return apiCall("auth", "getCurrentUser", params, opts);
}
export async function logout(opts) {
    const params = undefined;
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.logout(params, opts);
    }

    return apiCall("auth", "logout", params, opts);
}
