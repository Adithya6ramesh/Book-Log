import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "../env";
import { db } from "./db/index";
import * as schema from "./db/schema";

// For debugging
console.log("Auth configuration:", { 
  clientId: env.DISCORD_CLIENT_ID,
  baseUrl: env.VITE_SERVER_URL,
  webUrl: env.WEB_URL
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      callbackUrl: "/api/auth/callback/discord",
    },
  },
  baseUrl: env.VITE_SERVER_URL,
  trustedOrigins: [env.WEB_URL],
});

type AuthStatus =
  | "IsAuthenticated"
  | "IsNotAuthenticated"
  | "IsMaybeAuthenticated";

/**
 * Represents the authentication status of an application's routes.
 * This type is used to enforce type safety for route authentication requirements.
 *
 * @typedef {string} AuthStatus
 * @property {"IsAuthenticated"} IsAuthenticated - All routes require authentication
 * @property {"IsNotAuthenticated"} IsNotAuthenticated - No routes require authentication
 * @property {"IsMaybeAuthenticated"} IsMaybeAuthenticated - Some routes may require authentication
 *
 * @example
 * // All routes require auth
 * const app = new Hono<HonoAppContext<"IsAuthenticated">>();
 *
 * // Some routes may require auth (default)
 * const app = new Hono<HonoAppContext<"IsMaybeAuthenticated">>();
 *
 * // No routes require auth
 * const app = new Hono<HonoAppContext<"IsNotAuthenticated">>();
 */
export type HonoAppContext<
  Authenticated extends AuthStatus = "IsMaybeAuthenticated",
> = {
  Variables: {
    user: Authenticated extends "IsAuthenticated"
      ? typeof auth.$Infer.Session.user
      : Authenticated extends "IsNotAuthenticated"
        ? null
        : typeof auth.$Infer.Session.user | null;
    session: Authenticated extends "IsAuthenticated"
      ? typeof auth.$Infer.Session.session
      : Authenticated extends "IsNotAuthenticated"
        ? null
        : typeof auth.$Infer.Session.session | null;
  };
};
