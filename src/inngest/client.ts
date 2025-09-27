import { Inngest } from "inngest";
import { realtimeMiddleware } from "@inngest/realtime";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "s2c",
  middleware: [realtimeMiddleware()],
});
