import { registerGateways, registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";

import { googleLogin as auth_googleLoginImpl0 } from "../../../../auth/google-oauth";
import { googleCallback as auth_googleCallbackImpl1 } from "../../../../auth/google-oauth";
import { login as auth_loginImpl2 } from "../../../../auth/login";
import { refresh as auth_refreshImpl3 } from "../../../../auth/refresh";
import { register as auth_registerImpl4 } from "../../../../auth/register";
import { getCurrentUser as auth_getCurrentUserImpl5 } from "../../../../auth/session";
import { logout as auth_logoutImpl6 } from "../../../../auth/session";
import { getHistory as chat_getHistoryImpl7 } from "../../../../chat/get-history";
import { sendMessage as chat_sendMessageImpl8 } from "../../../../chat/send-message";
import { authCallback as google_ads_authCallbackImpl9 } from "../../../../google-ads/auth-callback";
import { authStart as google_ads_authStartImpl10 } from "../../../../google-ads/auth-start";
import { getInsights as google_ads_getInsightsImpl11 } from "../../../../google-ads/get-insights";
import { getPerformance as google_ads_getPerformanceImpl12 } from "../../../../google-ads/get-performance";
import { listCampaigns as google_ads_listCampaignsImpl13 } from "../../../../google-ads/list-campaigns";
import { health as health_healthImpl14 } from "../../../../health/health";
import * as auth_service from "../../../../auth/encore.service";
import * as health_service from "../../../../health/encore.service";
import * as google_ads_service from "../../../../google-ads/encore.service";
import * as chat_service from "../../../../chat/encore.service";

const gateways: any[] = [
];

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "auth",
            name:              "googleLogin",
            handler:           auth_googleLoginImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "auth",
            name:              "googleCallback",
            handler:           auth_googleCallbackImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "auth",
            name:              "login",
            handler:           auth_loginImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "auth",
            name:              "refresh",
            handler:           auth_refreshImpl3,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "auth",
            name:              "register",
            handler:           auth_registerImpl4,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "auth",
            name:              "getCurrentUser",
            handler:           auth_getCurrentUserImpl5,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "auth",
            name:              "logout",
            handler:           auth_logoutImpl6,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "chat",
            name:              "getHistory",
            handler:           chat_getHistoryImpl7,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: chat_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "chat",
            name:              "sendMessage",
            handler:           chat_sendMessageImpl8,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: chat_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "google-ads",
            name:              "authCallback",
            handler:           google_ads_authCallbackImpl9,
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
            handler:           google_ads_authStartImpl10,
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
            handler:           google_ads_getInsightsImpl11,
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
            handler:           google_ads_getPerformanceImpl12,
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
            handler:           google_ads_listCampaignsImpl13,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: google_ads_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "health",
            name:              "health",
            handler:           health_healthImpl14,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: health_service.default.cfg.middlewares || [],
    },
];

registerGateways(gateways);
registerHandlers(handlers);

await run(import.meta.url);
