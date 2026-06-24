import { env } from "#config/index.js";
import { app, init } from "./server.js";
import { logger, getServerInfo } from "#lib/index.js";

const { PORT } = env;

// Local / long-running process entry point (`npm start`, `npm run dev`).
// On Vercel the app is served via the serverless handler in `api/index.js`
// and this file is never executed.
init()
  .then(() => app.listen(PORT, () => logger.info(getServerInfo())))
  .catch((error) => {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });

export default app;
