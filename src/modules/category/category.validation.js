import { z } from "zod";

const imageSchema = z
  .object({ imageUrl: z.string(), altText: z.string().optional() })
  .passthrough();

const status = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

/**
 * Optional free-text field: an empty string from a form is stored as null.
 * `.optional()` stays outermost so an absent key is left out of the update
 * payload entirely instead of being nulled.
 */
const optionalText = z
  .string()
  .trim()
  .nullable()
  .transform((v) => v || null)
  .optional();

/** SEO for the category's blog listing page — every field optional. */
const blogSeoFields = {
  blogMetaTitle: optionalText,
  blogMetaDescription: optionalText,
  blogCanonicalUrl: optionalText,
  blogSeoSchema: optionalText,
};

/** One FAQ entry. Answers may carry HTML (internal links) rendered by the site. */
const faqItem = z.object({
  question: z.string().trim().default(""),
  answer: z.string().trim().default(""),
});

/** Ordered FAQ list; entries with neither a question nor an answer are dropped. */
const faqList = z
  .array(faqItem)
  .transform((list) => list.filter((f) => f.question || f.answer))
  .optional();
export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  breadcrumb: z.string().trim().min(1, "Breadcrumb is required"),
  bannerImage: imageSchema.optional(),
  path: z.string().trim().optional(),
  posterImage: imageSchema.optional(),
  metaTitle: z.string().trim().min(1, "Meta title is required"),
  metaDescription: z.string().trim().min(1, "Meta description is required"),
  canonicalUrl: z.string().trim().min(1, "Canonical URL is required"),
  seoSchema: z.string().trim().optional().nullable(),
  ...blogSeoFields,
  faq: faqList,
  status: status.optional(),
});

export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    breadcrumb: z.string().trim().min(1).optional(),
    bannerImage: imageSchema.optional(),
    path: z.string().trim().optional(),
    posterImage: imageSchema.optional(),
    metaTitle: z.string().trim().min(1).optional(),
    metaDescription: z.string().trim().min(1).optional(),
    canonicalUrl: z.string().trim().min(1).optional(),
    seoSchema: z.string().trim().optional().nullable(),
    ...blogSeoFields,
    faq: faqList,
    status: status.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });
