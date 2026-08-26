import { z } from "zod";

export const createAppointmentSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  phone: z.string().trim().min(1, "Phone is required"),
  whatsapp: z.string().trim().optional().nullable(),
  preferredDate: z
    .string()
    .trim()
    .min(1, "Preferred date is required")
    .refine(
      (date) =>
        date >= new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" }),
      "Preferred date cannot be in the past"
    ),
  availableTime: z.string().trim().min(1, "Preferred time is required"),
  emirate: z.string().trim().min(1, "Emirate is required"),
  area: z.string().trim().min(1, "Area is required"),
  hearAboutUs: z.string().trim().optional().nullable(),
  message: z
    .string()
    .trim()
    .max(1000, "Message must be 1000 characters or fewer")
    .optional()
    .nullable(),
  shutterTypes: z.array(z.string()).optional().default([]),

  lead_source: z.string().trim().optional().nullable(),
  gclid: z.string().trim().optional().nullable(),
  fbclid: z.string().trim().optional().nullable(),
  msclkid: z.string().trim().optional().nullable(),
  ttclid: z.string().trim().optional().nullable(),
  epik: z.string().trim().optional().nullable(),
  ScCid: z.string().trim().optional().nullable(),
  li_fat_id: z.string().trim().optional().nullable(),
  twclid: z.string().trim().optional().nullable(),
  utm_source: z.string().trim().optional().nullable(),
  utm_medium: z.string().trim().optional().nullable(),
  utm_campaign: z.string().trim().optional().nullable(),
  utm_content: z.string().trim().optional().nullable(),
  utm_term: z.string().trim().optional().nullable(),
  utm_matchtype: z.string().trim().optional().nullable(),
  landing_referrer: z.string().trim().optional().nullable(),
});
