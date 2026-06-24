import express from "express";

import { env } from "#config/index.js";
import { apolloServer } from "./apollo/server.js";
import { setupMiddleware } from "#middleware/index.js";
import { connectDatabase, logger, getServerInfo } from "#lib/index.js";

const { PORT } = env;
const app = express();

(async function main() {
  try {
    await connectDatabase();
    await apolloServer.start();

    setupMiddleware(app, apolloServer);

    app.get("/", (_req, res) =>
      res.json({ status: "OK", service: "shutter-backend" })
    );

    app.listen(PORT, () => logger.info(getServerInfo()));
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
})();

export default app;
