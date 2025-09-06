import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { getHistory as getHistory_handler } from "../../../../chat/get-history.js";
declare const getHistory: WithCallOpts<typeof getHistory_handler>;
export { getHistory };

import { sendMessage as sendMessage_handler } from "../../../../chat/send-message.js";
declare const sendMessage: WithCallOpts<typeof sendMessage_handler>;
export { sendMessage };


