// ------------------------------------------------------------
// SERVER
// ------------------------------------------------------------

import { serve } from "@hono/node-server";
import app from "./app";

serve(
  {
    fetch: app.fetch,
    port: 8080,
    hostname: "0.0.0.0",
  },
  (info) => {
    console.log(`🚀 Book-Log Server running on http://localhost:${info.port}`);
  }
);
