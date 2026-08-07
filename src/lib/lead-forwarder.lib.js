import { env } from "#config/index.js";
import { logger } from "./logger.lib.js";

const { TWOGUYS_LEAD_URL } = env;

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Forwards a booked appointment to the TwoGuys CRM as a lead.
 * Never throws — a CRM outage must not break the booking flow.
 */
export const forwardAppointmentLead = async (appointment) => {
  const body = {
    name: appointment.name,
    phone_number: appointment.phone,
    whatsapp_number: appointment.whatsapp || appointment.phone,
    email: appointment.email,
    message: appointment.message || "",
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(TWOGUYS_LEAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({params: { ...body }}),
      signal: controller.signal,
    });

    const responseBody = await res.text();
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText} - ${responseBody}`);
    }

    logger.info(`[lead-forwarder] TwoGuys lead push succeeded: ${responseBody}`);
  } catch (error) {
    logger.error(`[lead-forwarder] TwoGuys lead push failed: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
};

