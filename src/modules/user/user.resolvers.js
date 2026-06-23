import { prisma } from "#lib/index.js";

export const userResolvers = {
  Query: {
    user: async () => {
      try {
        return await prisma.user.findMany();
      } catch (error) {
        throw new Error(error);
      }
    },
    userById: async (_parent, { id }) => {
      try {
        return await prisma.user.findUnique({
          where: { id: id },
        });
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    updateUserById: async (_parent, { id, input }) => {
      try {
        return await prisma.user.update({
          where: { id: id },
          data: input,
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    removeUserById: async (_parent, { id }) => {
      try {
        return await prisma.user.delete({
          where: { id: id },
        });
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
