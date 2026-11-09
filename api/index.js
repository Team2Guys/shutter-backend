// Vercel serverless entry point. Every file in /api becomes a serverless
// function; vercel.json rewrites all incoming routes to this one handler,
// which delegates to the configured Express + Apollo app.
// Mail goes out through EMAIL_HOST (see src/lib/mail.lib.js); keep that on the
// server hostname with a valid certificate (server.blindsandcurtains.ae).
export { default } from "../src/server.js";
