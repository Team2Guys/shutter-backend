import { env } from "#config/index.js";
import { logger } from "./logger.lib.js";

const { TWOGUYS_LEAD_URL } = env;

const REQUEST_TIMEOUT_MS = 10_000;


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
    shutter_type: appointment.shutterTypes?.join(", ") || "",
    available_time: appointment.availableTime || "",
  };

  

logger.info(`[lead-forwarder] TwoGuys lead started: ${JSON.stringify({params: { ...body }})}`);

  try {
    const res = await fetch(TWOGUYS_LEAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({params: { ...body }}),
    });

    logger.info(`[lead-forwarder] shutter lead push response: ${res.status} ${res.statusText}`);



    logger.info(`[lead-forwarder] shutter lead push response: ${JSON.stringify({
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      url: res.url,
      headers: Object.fromEntries(res.headers),
    })}`);

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

          const responseBody = await res.json();
    logger.info(`[lead-forwarder] shutter lead push succeeded: ${JSON.stringify(responseBody)}`);
  } catch (error) {
    logger.error(`[lead-forwarder] shutter lead push error: ${JSON.stringify(error)}`);
    logger.error(`[lead-forwarder] shutter lead push failed: ${error.message}`);
  } 
};

