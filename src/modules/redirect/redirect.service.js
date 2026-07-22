import { prisma, cache, runImport } from "#lib/index.js";
import {
  normalizePath,
  createRedirectSchema,
  updateRedirectSchema,
} from "./redirect.validation.js";

const LIST_KEY = "redirects:list";

/** Fields a CSV import may write (statusCode arrives already coerced to a number). */
const IMPORTABLE_FIELDS = ["fromPath", "toPath", "statusCode"];

export const redirectService = {
  list: async () => {
    let data = await cache.get(LIST_KEY);
    if (!data) {
      data = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });
      await cache.set(LIST_KEY, data, 120);
    }
    return data;
  },

  byId: (id) => prisma.redirect.findUnique({ where: { id } }),

  byFrom: (fromPath) =>
    prisma.redirect.findUnique({ where: { fromPath: normalizePath(fromPath) } }),

  create: async (input, editor) => {
    const redirect = await prisma.redirect.create({
      data: { ...input, lastEditedBy: editor },
    });
    await cache.del(LIST_KEY);
    return redirect;
  },

  update: async (id, input, editor) => {
    const redirect = await prisma.redirect.update({
      where: { id },
      data: { ...input, lastEditedBy: editor },
    });
    await cache.del(LIST_KEY);
    return redirect;
  },

  remove: async (id) => {
    await prisma.redirect.delete({ where: { id } });
    await cache.del(LIST_KEY);
    return { success: true, message: "Redirect removed successfully." };
  },

  importMany: (rows, editor, canCreate) =>
    runImport({
      rows,
      editor,
      canCreate,
      fields: IMPORTABLE_FIELDS,
      createSchema: createRedirectSchema,
      updateSchema: updateRedirectSchema,
      // Match by id, then the unique (normalized) fromPath.
      findExisting: async (row, clean) => {
        if (row.id) {
          const byId = await prisma.redirect.findUnique({ where: { id: row.id } });
          if (byId) return byId;
        }
        if (clean.fromPath) {
          return prisma.redirect.findUnique({
            where: { fromPath: normalizePath(clean.fromPath) },
          });
        }
        return null;
      },
      create: (data, ed) => redirectService.create(data, ed),
      update: (id, data, ed) => redirectService.update(id, data, ed),
      label: (row) => row.fromPath || row.id || "row",
    }),
};
