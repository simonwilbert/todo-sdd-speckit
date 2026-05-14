import { createApp } from "./app.js";
import { prisma } from "./db/client.js";

/** Security headers (CSP, X-Content-Type-Options, etc.) are applied in `createApp` via `securityHeaders` middleware. */
const app = createApp(prisma);
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`api listening on http://localhost:${port}`);
});
