import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { googleLogin as googleLogin_handler } from "../../../../auth/google-oauth.js";
declare const googleLogin: WithCallOpts<typeof googleLogin_handler>;
export { googleLogin };

import { googleCallback as googleCallback_handler } from "../../../../auth/google-oauth.js";
declare const googleCallback: WithCallOpts<typeof googleCallback_handler>;
export { googleCallback };

import { login as login_handler } from "../../../../auth/login.js";
declare const login: WithCallOpts<typeof login_handler>;
export { login };

import { refresh as refresh_handler } from "../../../../auth/refresh.js";
declare const refresh: WithCallOpts<typeof refresh_handler>;
export { refresh };

import { register as register_handler } from "../../../../auth/register.js";
declare const register: WithCallOpts<typeof register_handler>;
export { register };

import { getCurrentUser as getCurrentUser_handler } from "../../../../auth/session.js";
declare const getCurrentUser: WithCallOpts<typeof getCurrentUser_handler>;
export { getCurrentUser };

import { logout as logout_handler } from "../../../../auth/session.js";
declare const logout: WithCallOpts<typeof logout_handler>;
export { logout };


