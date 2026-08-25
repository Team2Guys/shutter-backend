import { env, NOTIFICATION_RECIPIENTS } from "#config/index.js";
import { prisma, sendEmail, logger, forwardAppointmentLead } from "#lib/index.js";

const { FRONTEND_URL } = env;

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** "2026-07-15" -> "15 July 2026"; falls back to the raw value. */
const formatPreferredDate = (value) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

/** Fire-and-log emails; never let a mail failure break the booking. */
const sendAppointmentEmails = async (appointment) => {
  const types = appointment.shutterTypes?.length
    ? appointment.shutterTypes
    : ["Not specified"];
  const shutterTypesHtml = types.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  const location =
    [appointment.area, appointment.emirate].filter(Boolean).join(", ") || "Not provided";

  const vars = {
    name: appointment.name,
    email: appointment.email,
    phone: appointment.phone,
    whatsapp: appointment.whatsapp || "Not provided",
    location,
    preferredDate: formatPreferredDate(appointment.preferredDate),
    availableTime: appointment.availableTime,
    hearAboutUs: appointment.hearAboutUs || "Not provided",
    message: appointment.message || "—",
    shutterTypesHtml,
    FRONTEND_URL,
  };

  // 1) Confirmation to the customer
  try {
    await sendEmail("appointment-customer", {
      to: appointment.email,
      subject: "Appointment Confirmation - Shutters.ae",
      ...vars,
    });
  } catch (error) {
    logger.error(`[appointment] customer email failed: ${error.message}`);
  }

  // 2) Notification to the company inboxes
  if (NOTIFICATION_RECIPIENTS.length) {
    try {
      await sendEmail("appointment-admin", {
        to: NOTIFICATION_RECIPIENTS,
        subject: "Book A Free Design Visit Shutters.ae",
        ...vars,
      });
    } catch (error) {
      logger.error(`[appointment] admin email failed: ${error.message}`);
    }
  }
};

export const appointmentService = {
  list: () => prisma.appointment.findMany({ orderBy: { createdAt: "desc" } }),

  byId: (id) => prisma.appointment.findUnique({ where: { id } }),

  create: async (input) => {
    const appointment = await prisma.appointment.create({ data: input });
    // Fire-and-forget: neither must fail the booking, and an escaping rejection
    // would take the process down under Node's default unhandled-rejection mode.
    sendAppointmentEmails(appointment).catch((error) =>
      logger.error(`[appointment] email notification crashed: ${error.stack || error.message}`)
    );
    forwardAppointmentLead(appointment).catch((error) =>
      logger.error(`[appointment] lead forwarding crashed: ${error.stack || error.message}`)
    );
    return appointment;
  },
};
