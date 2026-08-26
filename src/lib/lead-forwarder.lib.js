import { env } from "#config/index.js";
import { logger } from "./logger.lib.js";
import { formatTrackedSource } from "./lead-source.lib.js";

const { TWOGUYS_LEAD_URL } = env;

export const forwardAppointmentLead = async (appointment) => {
  const body = {
    name: appointment.name,
    phone_number: appointment.phone,
    whatsapp_number: appointment.whatsapp || appointment.phone,
    email: appointment.email,
    message: appointment.message || "",
    availability: {
      date: appointment.preferredDate || "",
      time: appointment.availableTime || "",
    },
    emirate: appointment.emirate || "",
    area: appointment.area || "",
    referral_source: appointment.hearAboutUs || "",
    shutter_type: appointment.shutterTypes?.join(", ") || "",
    available_time: appointment.availableTime || "",
    tracked_source: {
      summary: formatTrackedSource(appointment) || null,
      lead_source: appointment.lead_source ?? null,
      gclid: appointment.gclid ?? null,
      fbclid: appointment.fbclid ?? null,
      msclkid: appointment.msclkid ?? null,
      ttclid: appointment.ttclid ?? null,
      epik: appointment.epik ?? null,
      ScCid: appointment.ScCid ?? null,
      li_fat_id: appointment.li_fat_id ?? null,
      twclid: appointment.twclid ?? null,
      utm_source: appointment.utm_source ?? null,
      utm_medium: appointment.utm_medium ?? null,
      utm_campaign: appointment.utm_campaign ?? null,
      utm_content: appointment.utm_content ?? null,
      utm_term: appointment.utm_term ?? null,
      utm_matchtype: appointment.utm_matchtype ?? null,
      landing_referrer: appointment.landing_referrer ?? null,
    },
  };

  const jsonbody = JSON.stringify({ params: { ...body } });
  logger.info(`[lead-forwarder] lead push started: appointment=${jsonbody} url=${TWOGUYS_LEAD_URL}`);

  try {
    const res = await fetch(TWOGUYS_LEAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonbody,
    });

    logger.info(`[lead-forwarder] lead push response: appointment=${jsonbody} ${res.status} ${res.statusText}`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const payload = await res.json();

    if (payload?.error) {
      throw new Error(`remote error: ${payload.error.data?.message || payload.error.message}`);
    }

    logger.info(`[lead-forwarder] lead push succeeded: appointment=${appointment.id} ${JSON.stringify(payload)}`);
  } catch (error) {
    // Swallowed on purpose: lead forwarding must never fail the appointment booking.
    
    logger.error(`[lead-forwarder] lead push failed: appointment=${JSON.stringify(error)}`);
    logger.error(`[lead-forwarder] lead push failed: appointment=${appointment.id} ${error.stack || error.message}`);
  }
};
