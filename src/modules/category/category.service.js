import { prisma, slugify, cache } from "#lib/index.js";

const LIST_KEY = "categories:list";

export const categoryService = {
  list: async () => {
    const cached = await cache.get(LIST_KEY);
    if (cached) return cached;
    const data = await prisma.category.findMany({ orderBy: { createdAt: "desc" } });
    await cache.set(LIST_KEY, data, 120);
    return data;
  },

  byId: (id) =>
    prisma.category.findUnique({
      where: { id },
      include: { products: true, blogs: true },
    }),

  byPath: (path) =>
    prisma.category.findUnique({
      where: { path },
      include: { products: true, blogs: true },
    }),

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
};
