import createError from "http-errors";
import { prisma } from "#lib/index.js";

export const categoryResolvers = {
  Query: {
    category: async () => {
      try {
        return await prisma.category.findMany({
          include: {
            subcategories: true,
          },
        });
      } catch (error) {
        throw new Error(error);
      }
    },

    categoryById: async (_parent, { id }) => {
      try {
        return await prisma.category.findUnique({
          where: { id: id },
        });
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    createCategory: async (_parent, { input }) => {
      try {
        const existingCategory = await prisma.category.findUnique({
          where: { name: input.name },
        });
        if (existingCategory) {
          throw createError(400, "Category already exists");
        }
        return await prisma.category.create({
          data: input,
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    updateCategoryById: async (_parent, { id, input }) => {
      try {
        return await prisma.category.update({
          where: { id: id },
          data: input,
        });
      } catch (errors) {
        throw new Error(error);
      }
    },

    removeCategoryById: async (_parent, { id }) => {
      try {
        await prisma.category.delete({
          where: { id: id },
        });
        return { message: "Category removed successfully" };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
