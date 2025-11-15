/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as investors_mutations from "../investors/mutations.js";
import type * as investors_queries from "../investors/queries.js";
import type * as portfolio_actions from "../portfolio/actions.js";
import type * as portfolio_mutations from "../portfolio/mutations.js";
import type * as portfolio_queries from "../portfolio/queries.js";
import type * as scalper_mutations from "../scalper/mutations.js";
import type * as scalper_queries from "../scalper/queries.js";
import type * as screeners_mutations from "../screeners/mutations.js";
import type * as screeners_queries from "../screeners/queries.js";
import type * as stocks_analysis from "../stocks/analysis.js";
import type * as stocks_mutations from "../stocks/mutations.js";
import type * as stocks_queries from "../stocks/queries.js";
import type * as trading_mutations from "../trading/mutations.js";
import type * as trading_queries from "../trading/queries.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "investors/mutations": typeof investors_mutations;
  "investors/queries": typeof investors_queries;
  "portfolio/actions": typeof portfolio_actions;
  "portfolio/mutations": typeof portfolio_mutations;
  "portfolio/queries": typeof portfolio_queries;
  "scalper/mutations": typeof scalper_mutations;
  "scalper/queries": typeof scalper_queries;
  "screeners/mutations": typeof screeners_mutations;
  "screeners/queries": typeof screeners_queries;
  "stocks/analysis": typeof stocks_analysis;
  "stocks/mutations": typeof stocks_mutations;
  "stocks/queries": typeof stocks_queries;
  "trading/mutations": typeof trading_mutations;
  "trading/queries": typeof trading_queries;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
