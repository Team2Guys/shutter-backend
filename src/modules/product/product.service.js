import { prisma, slugify, cache, runImport } from "#lib/index.js";
import {
  createProductSchema,
  updateProductSchema,
} from "./product.validation.js";

const LIST_KEY = "products:list";

/** Scalar fields a CSV import may write (images/relations handled separately). */
const IMPORTABLE_FIELDS = [
  "name",
  "description",
  "breadcrumb",
  "path",
  "firstHeading",
  "firstSubTitle",
  "firstDescription",
  "secondHeading",
  "secondSubTitle",
  "secondDescription",
  "imageHeading",
  "faq",
  "metaTitle",
  "metaDescription",
  "canonicalUrl",
  "seoSchema",
  "status",
];

/** Resolve a category reference (id, name, or path) to a category id. */
const resolveCategoryId = async (row) => {
  const rawId = row.categoryId != null ? String(row.categoryId).trim() : "";
  if (rawId) return rawId;
  const ref = row.category != null ? String(row.category).trim() : "";
  if (!ref) return null;
  const category = await prisma.category.findFirst({
    where: { OR: [{ name: ref }, { path: ref }] },
  });
  if (!category) throw new Error(`category "${ref}" not found`);
  return category.id;
};

export const productService = {
  list: async (onlyPublished = false) => {
    let data = await cache.get(LIST_KEY);
    if (!data) {
      data = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true },
      });
      await cache.set(LIST_KEY, data, 120);
    }
    return onlyPublished ? data.filter((p) => p.status === "PUBLISHED") : data;
  },

  byId: (id) =>
    prisma.product.findUnique({ where: { id }, include: { category: true } }),

  byPath: async (path, onlyPublished = false) => {
    const product = await prisma.product.findUnique({
      where: { path },
      include: { category: true },
    });
    if (onlyPublished && product && product.status !== "PUBLISHED") return null;
    return product;
  },

  byCategory: (categoryId, onlyPublished = false) =>
    prisma.product.findMany({
      where: {
        categoryId,
        ...(onlyPublished ? { status: "PUBLISHED" } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),

  create: async (input, editor) => {
    const path = input.path?.trim() || slugify(input.name);
    const product = await prisma.product.create({
      data: { ...input, path, lastEditedBy: editor },
      include: { category: true },
    });
    await cache.del(LIST_KEY);
    return product;
  },

  update: async (id, input, editor) => {
    const data = { ...input, lastEditedBy: editor };
    if (input.path) data.path = input.path.trim();
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
    await cache.del(LIST_KEY);
    return product;
  },

  remove: async (id) => {
    await prisma.product.delete({ where: { id } });
    await cache.del(LIST_KEY);
    return { success: true, message: "Product removed successfully." };
  },

  importMany: (rows, editor, canCreate) =>
    runImport({
      rows,
      editor,
      canCreate,
      fields: IMPORTABLE_FIELDS,
      createSchema: createProductSchema,
      updateSchema: updateProductSchema,
      // Product name isn't unique, so match by id then the unique path.
      findExisting: async (row, clean) => {
        if (row.id) {
          const byId = await prisma.product.findUnique({ where: { id: row.id } });
          if (byId) return byId;
        }
        if (clean.path) {
          return prisma.product.findUnique({ where: { path: clean.path } });
        }
        return null;
      },
      // Turn the category reference into a categoryId (kept for updates only when given).
      normalize: async (clean, row) => {
        const categoryId = await resolveCategoryId(row);
        if (categoryId) clean.categoryId = categoryId;
        return clean;
      },
      create: (data, ed) => productService.create(data, ed),
      update: (id, data, ed) => productService.update(id, data, ed),
      label: (row) => row.name || row.path || row.id || "row",
    }),
};
