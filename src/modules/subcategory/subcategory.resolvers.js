import { prisma } from "#lib/index.js";

export const subcategoryResolvers = {
  Query: {
    subcategory: async () => {
      try {
        return await prisma.Subcategory.findMany({
          include: {
            category: true,
          },
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    subcategoryById: async (_parent, { id }) => {
      try {
        return await prisma.Subcategory.findUnique({
          where: { id: id },
          include: {
            category: true,
          },
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    subcategoryBySlug: async (_parent, { slug }) => {
      try {
        return await prisma.Subcategory.findFirst({
          where: { slug: slug },
          include: {
            category: true,
          },
        });
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    createSubcategory: async (_parent, { input }) => {
      try {
        const existingSubcategory = await prisma.Subcategory.findUnique({
          where: { name: input.name },
        });
        if (existingSubcategory) {
          throw createError(400, "Subcategory already exists");
        }
        await prisma.Subcategory.create({
          data: input,
        });
        return {
          message: "Subcategory fetched successfully",
        };
      } catch (error) {
        throw new Error(error);
      }
    },

    updateSubcategoryById: async (_parent, { id, input }) => {
      try {
        await prisma.Subcategory.update({
          where: { id: id },
          data: input,
        });
        return {
          message: "Subcategory Update successfully",
        };
      } catch (error) {
        throw new Error(error);
      }
    },

    removeSubcategoryById: async (_parent, { id }) => {
      try {
        await prisma.Subcategory.delete({
          where: { id: id },
        });
        return {
          message: "Subcategory removed successfully",
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
