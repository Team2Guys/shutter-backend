import { prisma, slugify, cache, runImport } from "#lib/index.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";

const LIST_KEY = "categories:list";

/** Fields a CSV import is allowed to write (images/timestamps excluded). */
const IMPORTABLE_FIELDS = [
  "name",
  "description",
  "breadcrumb",
  "path",
  "metaTitle",
  "metaDescription",
  "canonicalUrl",
  "seoSchema",
  "status",
];

export const categoryService = {
  list: async (onlyPublished = false) => {
    let data = await cache.get(LIST_KEY);
    if (!data) {
      data = await prisma.category.findMany({ orderBy: { createdAt: "desc" } });
      await cache.set(LIST_KEY, data, 120);
    }
    return onlyPublished ? data.filter((c) => c.status === "PUBLISHED") : data;
  },

  byId: (id) =>
    prisma.category.findUnique({
      where: { id },
      include: { products: true, blogs: true },
    }),

  byPath: async (path, onlyPublished = false) => {
    const category = await prisma.category.findUnique({
      where: { path },
      include: onlyPublished
        ? {
            products: { where: { status: "PUBLISHED" } },
            blogs: { where: { status: "PUBLISHED" } },
          }
        : { products: true, blogs: true },
    });
    // A draft/archived category isn't visible to the public.
    if (onlyPublished && category && category.status !== "PUBLISHED") return null;
    return category;
  },

  create: async (input, editor) => {
    const path = input.path?.trim() || slugify(input.name);
    const category = await prisma.category.create({
      data: { ...input, path, lastEditedBy: editor },
    });
    await cache.del(LIST_KEY);
    return category;
  },

  update: async (id, input, editor) => {
    const data = { ...input, lastEditedBy: editor };
    if (input.path) data.path = input.path.trim();
    const category = await prisma.category.update({ where: { id }, data });
    await cache.del(LIST_KEY);
    return category;
  },

  remove: async (id) => {
    await prisma.category.delete({ where: { id } });
    await cache.del(LIST_KEY);
    return { success: true, message: "Category removed successfully." };
  },

  /**
   * Bulk import from CSV rows. Each row is upserted independently: an existing
   * category (matched by id, then path, then name) is updated with the provided
   * fields; otherwise a new one is created. Images are never touched. Errors are
   * collected per row so one bad row doesn't abort the whole import.
   *
   * @param {object[]} rows   Parsed CSV rows (may carry an `id` column).
   * @param {string}   editor Name recorded in `lastEditedBy`.
   * @param {boolean}  canCreate Whether the caller may create new categories.
   */
  importMany: (rows, editor, canCreate) =>
    runImport({
      rows,
      editor,
      canCreate,
      fields: IMPORTABLE_FIELDS,
      createSchema: createCategorySchema,
      updateSchema: updateCategorySchema,
      // Match an existing row: id first, then the unique path, then the name.
      findExisting: async (row, clean) => {
        if (row.id) {
          const byId = await prisma.category.findUnique({ where: { id: row.id } });
          if (byId) return byId;
        }
        if (clean.path) {
          const byPath = await prisma.category.findUnique({
            where: { path: clean.path },
          });
          if (byPath) return byPath;
        }
        if (clean.name) {
          return prisma.category.findUnique({ where: { name: clean.name } });
        }
        return null;
      },
      create: (data, ed) => categoryService.create(data, ed),
      update: (id, data, ed) => categoryService.update(id, data, ed),
      label: (row) => row.name || row.path || row.id || "row",
    }),
};
