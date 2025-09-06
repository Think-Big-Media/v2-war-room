import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as auth_service from "../../../../auth/encore.service";

export async function googleLogin(params, opts) {
    const handler = (await import("../../../../auth/google-oauth")).googleLogin;
    registerTestHandler({
        apiRoute: { service: "auth", name: "googleLogin", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "googleLogin", params, opts);
}

export async function googleCallback(params, opts) {
    const handler = (await import("../../../../auth/google-oauth")).googleCallback;
    registerTestHandler({
        apiRoute: { service: "auth", name: "googleCallback", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "googleCallback", params, opts);
}

export async function login(params, opts) {
    const handler = (await import("../../../../auth/login")).login;
    registerTestHandler({
        apiRoute: { service: "auth", name: "login", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "login", params, opts);
}

export async function refresh(params, opts) {
    const handler = (await import("../../../../auth/refresh")).refresh;
    registerTestHandler({
        apiRoute: { service: "auth", name: "refresh", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "refresh", params, opts);
}

export async function register(params, opts) {
    const handler = (await import("../../../../auth/register")).register;
    registerTestHandler({
        apiRoute: { service: "auth", name: "register", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "register", params, opts);
}

export async function getCurrentUser(params, opts) {
    const handler = (await import("../../../../auth/session")).getCurrentUser;
    registerTestHandler({
        apiRoute: { service: "auth", name: "getCurrentUser", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "getCurrentUser", params, opts);
}

export async function logout(params, opts) {
    const handler = (await import("../../../../auth/session")).logout;
    registerTestHandler({
        apiRoute: { service: "auth", name: "logout", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "logout", params, opts);
}

