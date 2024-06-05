import express from "express";
import cors from "cors";

import { moviesRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";

const app = express();
app.use(express.json());
app.use(corsMiddleware());
app.disable("x-powered-by");

app.use("/movies", moviesRouter);

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
