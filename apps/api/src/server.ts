import { createApp } from "./app.js";
import { prisma } from "./db/client.js";

const app = createApp(prisma);
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`api listening on http://localhost:${port}`);
});
