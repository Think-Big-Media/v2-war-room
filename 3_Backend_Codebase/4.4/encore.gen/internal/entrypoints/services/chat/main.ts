import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { getHistory as getHistoryImpl0 } from "../../../../../chat/get-history";
import { sendMessage as sendMessageImpl1 } from "../../../../../chat/send-message";
import * as chat_service from "../../../../../chat/encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "chat",
            name:              "getHistory",
            handler:           getHistoryImpl0,
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
            handler:           sendMessageImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: chat_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
