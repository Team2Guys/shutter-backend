import { prisma, slugify, cache } from "#lib/index.js";

const LIST_KEY = "blogs:list";

export const blogService = {
  list: async () => {
    const cached = await cache.get(LIST_KEY);
    if (cached) return cached;
    const data = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    await cache.set(LIST_KEY, data, 120);
    return data;
  },

  byId: (id) =>
    prisma.blog.findUnique({ where: { id }, include: { category: true } }),

  byPath: (path) =>
    prisma.blog.findUnique({ where: { path }, include: { category: true } }),

  byCategory: (categoryId) =>
    prisma.blog.findMany({
      where: { categoryId },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),

  create: async (input, editor) => {
    const path = input.path?.trim() || slugify(input.title);
    const blog = await prisma.blog.create({
      data: { ...input, path, lastEditedBy: editor },
      include: { category: true },
    });
    await cache.del(LIST_KEY);
    return blog;
  },

  update: async (id, input, editor) => {
    const data = { ...input, lastEditedBy: editor };
    if (input.path) data.path = input.path.trim();
    const blog = await prisma.blog.update({
      where: { id },
      data,
      include: { category: true },
    });
    await cache.del(LIST_KEY);
    return blog;
  },

  remove: async (id) => {
    await prisma.blog.delete({ where: { id } });
    await cache.del(LIST_KEY);
    return { success: true, message: "Blog removed successfully." };
  },
};
