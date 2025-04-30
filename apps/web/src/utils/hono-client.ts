import { hcWithType } from "@repo/server/hc";

export const client = hcWithType("http://localhost:8000", {
  init: { credentials: "include" },
});
