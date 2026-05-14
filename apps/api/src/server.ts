import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get("/", (_req, res) => {
  res.type("text/plain").send("Todo API — routes land in Foundational phase");
});

app.listen(port, () => {
  console.log(`api listening on http://localhost:${port}`);
});
