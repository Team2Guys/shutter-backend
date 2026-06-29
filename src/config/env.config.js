import dotenv from "dotenv";
import { cleanEnv, str, port, email, url, testOnly } from "envalid";

dotenv.config();

const validators = {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
    desc: "Environment type",
  }),
  // Defaulted (not devDefault): serverless platforms like Vercel never bind a
  // port, so this must not become a required var in production.
  PORT: port({ default: 5000, desc: "Port number" }),

  BACKEND_URL: url({ desc: "Backend URL" }),
  FRONTEND_URL: url({ desc: "Public website URL" }),
  DASHBOARD_URL: url({
    devDefault: "http://localhost:3000",
    desc: "Admin dashboard URL",
  }),

  DATABASE_URL: url({ desc: "Database connection string" }),

  JWT_SECRET: str({
    devDefault: testOnly("test-secret"),
    desc: "JWT secret key",
  }),

  // Mail (SMTP) configuration
  EMAIL_HOST: str({ desc: "SMTP host" }),
  EMAIL_PORT: port({ desc: "SMTP port" }),
  USER_EMAIL: email({ desc: "SMTP / sender email address" }),
  USER_PASSWORD: str({ desc: "SMTP password" }),

  // Dedicated sending account (appointment + contact mail is sent FROM here)
  EMAIL_USER: str({ default: "", desc: "Sender email account (e.g. cs@shutters.ae)" }),
  EMAIL_PASS: str({ default: "", desc: "Password for EMAIL_USER" }),

  // SMTP mailbox login (preferred transporter credentials)
  ADMIN_MAIL: str({ default: "", desc: "SMTP mailbox login email" }),
  ADMIN_PASSWORD: str({ default: "", desc: "SMTP mailbox login password" }),

  // Company inboxes that receive new appointment/contact notifications
  ORDER_MAIL1: str({ default: "", desc: "Notification inbox 1" }),
  ORDER_MAIL2: str({ default: "", desc: "Notification inbox 2" }),
  ORDER_MAIL3: str({ default: "", desc: "Notification inbox 3" }),
  ORDER_MAIL4: str({ default: "", desc: "Notification inbox 4" }),

  // Redis (optional — falls back to in-memory cache if unavailable)
  REDIS_URL: str({ default: "", desc: "Redis connection string" }),

  // Bootstrap super admin (created via `npm run db:seed`)
  SUPER_ADMIN_NAME: str({ default: "Super Admin", desc: "Bootstrap super admin name" }),
  SUPER_ADMIN_EMAIL: email({ desc: "Bootstrap super admin email" }),
  SUPER_ADMIN_PASSWORD: str({ desc: "Bootstrap super admin password" }),
};

export const env = cleanEnv(process.env, validators, {
  reporter: ({ errors }) => {
    const invalidVars = Object.keys(errors);
    if (invalidVars.length > 0) {
      console.error(
        `\nInvalid / missing environment variables:\n- ${invalidVars.join(
          "\n- "
        )}\n\nPlease set the above variables correctly in your .env file.\n`
      );
      process.exit(1);
    }
  },
});

/** Strip stray quotes / commas / whitespace from an env value. */
const cleanEmail = (v) => (v || "").replace(/^[\s",]+|[\s",]+$/g, "").trim();

/** Company inboxes that receive appointment + contact notifications. */
export const NOTIFICATION_RECIPIENTS = [
  env.ORDER_MAIL1,
  env.ORDER_MAIL2,
  env.ORDER_MAIL3,
  env.ORDER_MAIL4,
]
  .map(cleanEmail)
  .filter(Boolean);
