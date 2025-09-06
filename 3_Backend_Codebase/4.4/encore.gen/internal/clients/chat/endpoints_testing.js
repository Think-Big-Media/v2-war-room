import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as chat_service from "../../../../chat/encore.service";

export async function getHistory(params, opts) {
    const handler = (await import("../../../../chat/get-history")).getHistory;
    registerTestHandler({
        apiRoute: { service: "chat", name: "getHistory", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: chat_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("chat", "getHistory", params, opts);
}

export async function sendMessage(params, opts) {
    const handler = (await import("../../../../chat/send-message")).sendMessage;
    registerTestHandler({
        apiRoute: { service: "chat", name: "sendMessage", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: chat_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("chat", "sendMessage", params, opts);
}

