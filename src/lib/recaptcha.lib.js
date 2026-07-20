import createError from "http-errors";

import { env } from "#config/index.js";
import { logger } from "./logger.lib.js";

const { RECAPTCHA_SECRET_KEY } = env;
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/**
 * Verify a Google reCAPTCHA v2 token against Google's siteverify API.
 *
 * If no secret key is configured the check is skipped (verification disabled),
 * so the public forms keep working until reCAPTCHA keys are set up.
 * Throws a 400 when the token is missing or fails verification.
 *
 * @param {string} token the g-recaptcha-response value from the browser widget
 */
export const verifyRecaptcha = async (token) => {
  if (!RECAPTCHA_SECRET_KEY) return; // not configured — skip verification

  if (!token) {
    throw createError(400, "Please complete the reCAPTCHA verification.");
  }

  try {
    const body = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token,
    });
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const data = await res.json();

    if (!data.success) {
      logger.warn(
        `[recaptcha] verification failed: ${(data["error-codes"] || []).join(", ") || "unknown"}`
      );
      throw createError(400, "reCAPTCHA verification failed. Please try again.");
    }
  } catch (error) {
    if (error.status) throw error; // re-throw our own 400s
    logger.error(`[recaptcha] verify request error: ${error.message}`);
    throw createError(400, "Could not verify reCAPTCHA. Please try again.");
  }
};
