import { prisma, cache, runImport } from "#lib/index.js";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "./testimonial.validation.js";

const LIST_KEY = "testimonials:list";

/** Fields a CSV import may write (rating arrives already coerced to a number). */
const IMPORTABLE_FIELDS = ["name", "designation", "rating", "description", "status"];

export const testimonialService = {
  list: async (onlyPublished = false) => {
    let data = await cache.get(LIST_KEY);
    if (!data) {
      data = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
      await cache.set(LIST_KEY, data, 120);
    }
    return onlyPublished ? data.filter((t) => t.status === "PUBLISHED") : data;
  },

  byId: (id) => prisma.testimonial.findUnique({ where: { id } }),

  create: async (input, editor) => {
    const testimonial = await prisma.testimonial.create({
      data: { ...input, lastEditedBy: editor },
    });
    await cache.del(LIST_KEY);
    return testimonial;
  },

  update: async (id, input, editor) => {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { ...input, lastEditedBy: editor },
    });
    await cache.del(LIST_KEY);
    return testimonial;
  },

  remove: async (id) => {
    await prisma.testimonial.delete({ where: { id } });
    await cache.del(LIST_KEY);
    return { success: true, message: "Testimonial removed successfully." };
  },

  importMany: (rows, editor, canCreate) =>
    runImport({
      rows,
      editor,
      canCreate,
      fields: IMPORTABLE_FIELDS,
      createSchema: createTestimonialSchema,
      updateSchema: updateTestimonialSchema,
      // Testimonials have no natural unique key, so only an id matches an update.
      findExisting: (row) =>
        row.id ? prisma.testimonial.findUnique({ where: { id: row.id } }) : null,
      create: (data, ed) => testimonialService.create(data, ed),
      update: (id, data, ed) => testimonialService.update(id, data, ed),
      label: (row) => row.name || row.id || "row",
    }),
};
