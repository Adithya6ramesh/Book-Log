# Reno Stack

![Reno Stack Banner](https://raw.githubusercontent.com/kasraghoreyshi/kasraghoreyshi/refs/heads/main/banner.jpg)

> **CSR-focused • Self-hostable • Opinionated**

Reno Stack is a modern, opinionated web app starter kit built for speed, efficiency, and self-hosting

## 🚀 Features

- ⚛️ **React App powered by Vite** – Simple, ridiculously fast, reliable
- 🔐 **Authentication Included** Dead simple authentication using [Better-Auth](https://www.better-auth.com/docs)
- 🎨 **Tailwind + Shadcn** – Build beautiful UI at a fast pace
- 🔗 **Type-safe and powerful DX** End-to-end type safety between client and server
- 🛠️ **Easily self-hostable** By default _everything_ is self-hostable
- 🧩 **Drizzle ORM** A type-safe, efficient and modern ORM

- 📦 **PNPM** An NPM alternative with better workspace support

## Project Structure

```text
.vscode
  └─ Settings for VSCode users
apps
  ├─ server
  |   ├─ Node server using Hono
  |   ├─ Fully type-safe database calls using Drizzle ORM
  |   ├─ Type-safe .env file via @t3-oss/env-core
  |   └─ Simple yet powerful authentication setup via Better-Auth
  └─ web
      ├─ React
      ├─ Vite
      ├─ Tailwind CSS
      ├─ React Hook Form
      ├─ React Query alongside a custom TRPC-like implementation of Hono RPC
      └─ File-based routing powered by Tanstack Router
packages
  ├─ ui
  |   └─ UI components using Shadcn
  └─ validators
      └─ Zod schemas that are shared between client and server
```

## Quick start for running the example app

Before proceeding, it's highly recommended that you read the sections below to understand the stack better. But eitherways, here's how you can run the example app:

```text
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push
```

You will need to create a Discord application which is possible via this link: https://discord.com/developers/applications

After creating the application, navigate to it's settings page and then click on `OAuth2` on the sidebar. Add the following to `Redirects`:

```
http://localhost:8000/api/auth/callback/discord
```

At last, grab the CLIENT_ID and CLIENT_SECRET and add them to the `.env` file.

If you've changed the server's default port, make sure to both include it in the `VITE_SERVER_URL` environment variable and in the the redirect URI above

Visit `http://localhost:5173` and start building! 🚀

![Example App Screenshot](https://raw.githubusercontent.com/kasraghoreyshi/kasraghoreyshi/refs/heads/main/example-app.png)

## Type-safety

Reno Stack has a relatively unique approach for handling E2E type-safety. [Hono RPC](https://hono.dev/docs/guides/rpc) is an amazing start for having type-safety, but some difficulties start to occur when you want to use it with React Query (which is what this stack uses and heavily recommends, since rolling your own fetching strategy requires a lot of boilerplate)

### The Problem

Let's say we have a `notes` router and we want to use Hono RPC alongside React Query, this is the simplest approach that could get us started:

```typescript
const notesQuery = useQuery({
  queryKey: ["notes"],
  queryFn: () => client.notes.$get(),
});
```

Simple enough, right? Except the fetch API (which Hono RPC uses under the hood) doesn't handle errors by default, so we'd need some sort of fetch wrapper that takes care of errors, okay...

```typescript
// Let's say you made a general purpose and type-safe wrapper around fetch
const fetchWrapper = (endpoint: ...) => {...}

const  notesQuery = useQuery({
queryKey: ["notes"],
queryFn: () => fetchWrapper(client.notes.$get)
});
```

Now this may seem like it's fully type-safe, but it can get annoying. What if some of our endpoints occasionally return errors? We'd have to do something like `InferResponseType<typeof client.notes.$get, 200>` to get the success payload type. Not to mention you'd have to do the same for mutations and their error types.

This will result in a lot of repetition in the long run, `fetchWrapper` is repeated every time and perhaps the worst of all, our `queryKey` is a magical array. If we want to invalidate it somewhere else, we have no safe way of accessing it, unless we create a central file for keeping the keys. Now unto what Reno Stack does to mitigate these problems:

### The Solution

React Query has a feature called [QueryOptions](https://tanstack.com/query/latest/docs/framework/react/guides/query-options) which is basically for creating reusable `queryFn` and `queryKey`s. By taking advantage of this, we've made a [custom utility](https://github.com/kasraghoreyshi/reno-stack/blob/main/apps/web/src/utils/query-utils.ts) that couples extremely well with Hono RPC. This utility gives you two functions called `createQueryOptions` and `createMutationOptions`. Here's how you'd use them:

For each route of our application, we'll create a `{route}.queries.ts` under a folder named `queries` in our web application (these naming conventions are arbitrary and can be changed to anything that you'd like)

Let's use the same example route in the _Problem_ section which is a `notes` route. In `notes.queries.ts`, you would have something like this:

```typescript
import { client } from "../utils/hono-client";

import {
  createMutationOptions,
  createQueryOptions,
} from "../utils/query-utils";

export const notesQueryOptions = createQueryOptions(
  ["notes"],
  client.notes.$get
);

export const noteByIdQueryOptions = createQueryOptions(
  ({ param: { id } }) => ["notes", id],
  client.notes[":id"].$get
);

export const createNoteMutationOptions = createMutationOptions(
  client.notes.$post
);
```

We only need to pass the endpoint returned from our Hono RPC's client and the rest is handled by the utility. This utility takes cares of the problems mentioned above and here's how we would use them:

```typescript
const notesQuery = useQuery(notesQueryOptions());
```

Simple as that! and when it's time to invalidate any of these queries, you could do something like:

```typescript
await queryClient.invalidateQueries({
  queryKey: notesQueryOptions().queryKey,
});
```

No more magic literals and fully type-safe. Mutations are also used in the same way.

## Database

Reno Stack uses Drizzle and the postrgres driver by default. Once you've set your environment variables from `.env.example` and populated `DATABASE_URL`, you can push the drizzle migrations by running `pnpm db:push` at the project's root level. You can view and change the schema by opening `schema.ts`, however as long as you are using Better-Auth which is included by default, you _do not_ want to change anything in `auth-schema.ts` unless you are following [this guide](https://www.better-auth.com/docs/concepts/database#custom-table-names).

You can also use the `pnpm db:studio` command to open the Drizzle Studio UI where you can view the database schema and data.

## Authentication

It's highly recommended that you check out [Better-Auth's documentation](https://www.better-auth.com/docs/introduction) for learning more about the library.

In short, you have a default schema file (`auth-schema.ts`) in the server app that is generated by Better-Auth and a main entry point called `auth.ts`. You can add any strategies that you want such as OAuth2 (Reno Stack's example comes with a Discord OAuth integration), email and password, OTP, etc

Reno Stack comes with a `withAuth` middleware that you could use in any of your routes/group of routes. Example usage of a simple `notes` router:

```typescript
export const notes = new Hono<HonoAppContext>()
	.post("/", zValidator("json", createNotesSchema), withAuth, async (c) => {
	const  user = c.var.user;
	const { title, content } = await c.req.valid("json");
	// ...
```

## Creating new routes and new components

There are two commands that can help you create new routes and new components.

### Creating a new route

Simply run `pnpm create:route <name>` and you'll get a new route file in the `apps/server/src/routes` folder.

### Creating a new component

Simply run `pnpm ui-add <name>` and select which UI components you want to add from the Shadcn UI library. They will appear in `packages/ui/src` folder.

## Motivation

This stack is heavily inspired by the [T3 stack](https://create.t3.gg/) and it's [Turborepo template](https://github.com/t3-oss/create-t3-turbo). However, Reno Stack takes a slightly different approach to building full-stack web applications.

Instead of letting Next handle both API and client, in Reno Stack they are decoupled. Your frontend is a React application powered by Vite and your backend server is powered by Hono and they communicate with each other through type-safe API calls. Faster iteration, simple and efficient.

There are debates on whether or not search engines have improved so much that websites using CSR wouldn't be any different than the server-first ones, but generally Reno Stack's philosophy works particularly well for websites that don't rely on SEO, because you won't have features like SSG and SSR enabled by default (although it is possible, it's just not included in this template at this point)

## Future Plans

While Reno Stack is very opinionated at it's core, having a CLI tool to help you generate new projects and use different technologies (e.g. different ORM, different frontend framework) would be ideal

## 🧑‍💻 Contributing

PRs are very welcome. Open an issue or drop feedback!
