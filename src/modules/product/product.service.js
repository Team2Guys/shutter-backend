import { prisma, slugify, cache } from "#lib/index.js";

const LIST_KEY = "products:list";

export const productService = {
  list: async () => {
    const cached = await cache.get(LIST_KEY);
    if (cached) return cached;
    const data = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    await cache.set(LIST_KEY, data, 120);
    return data;
  },

  byId: (id) =>
    prisma.product.findUnique({ where: { id }, include: { category: true } }),

  byPath: (path) =>
    prisma.product.findUnique({ where: { path }, include: { category: true } }),

  byCategory: (categoryId) =>
    prisma.product.findMany({
      where: { categoryId },
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
};
