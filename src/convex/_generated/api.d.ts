/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analytics from "../analytics.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as challenges from "../challenges.js";
import type * as forums from "../forums.js";
import type * as http from "../http.js";
import type * as modules from "../modules.js";
import type * as opportunities from "../opportunities.js";
import type * as quizzes from "../quizzes.js";
import type * as seedData from "../seedData.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  challenges: typeof challenges;
  forums: typeof forums;
  http: typeof http;
  modules: typeof modules;
  opportunities: typeof opportunities;
  quizzes: typeof quizzes;
  seedData: typeof seedData;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
