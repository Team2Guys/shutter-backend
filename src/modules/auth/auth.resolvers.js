import { prisma, bcryptUtils, tokenUtils } from "#lib/index.js";
import createError from "http-errors";
import { env } from "#config/index.js";
import { sendEmail } from "#lib/mail.lib.js";

const { FRONTEND_URL } = env;

export const authResolvers = {
  Mutation: {
    signUp: async (_parent, { input }) => {
      const { password, ...rest } = input;
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: input.email,
          },
        });
        if (existingUser) {
          return {
            message: "User already exists",
          };
        }
        const hashedPassword = await bcryptUtils.hash(password, { rounds: 12 });
        const newUser = await prisma.user.create({
          data: {
            ...rest,
            password: hashedPassword,
          },
        });
        const verificationToken = tokenUtils.generate(
          { id: newUser.id },
          "verificationToken"
        );
        if (!verificationToken) {
          throw createError(500, "Failed to generate verification token.");
        }

        const sentEmail = await sendEmail("verification-email", {
          email: input.email,
          subject: "Email Verification",
          FRONTEND_URL,
          verificationToken,
        });
        if (!sentEmail) throw createError(500, "Failed to send welcome email.");
        return {
          verificationToken,
          message: "Registered successfully. Check your email to verify your account.",
        };
      } catch (error) {
        return {
          message: error.message || "Something went wrong",
        };
      }
    },

    signIn: async (_parent, { input }) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: input.email,
          },
        });
        if (!user) {
          throw createError(404, "User not found");
        }
        const isPasswordValid = await bcryptUtils.compare(
          input.password,
          user.password
        );
        if (!isPasswordValid) {
          throw createError(401, "Invalid password");
        }
        const accessToken = tokenUtils.generate({ id: user.id }, "accessToken");
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          accessToken,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    passwordResetRequest: async (_parent, { input }) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: input.email,
          },
        });
        if (!existingUser) {
          throw createError(404, "User not found");
        }
        const resetToken = tokenUtils.generate(
          { id: existingUser.id },
          "passwordResetToken"
        );
        if (!resetToken) {
          throw createError(500, "Failed to generate reset token.");
        }
        return {
          resetToken,
          message: "Password reset token sent successfully",
        };
      } catch (error) {
        throw new Error(error);
      }
    },

    updatePassword: async (_parent, { input }) => {
      const { resetToken, password } = input;
      try {
        const { id } = tokenUtils.verify(resetToken);

        const hashedPassword = await bcryptUtils.hash(password, { rounds: 12 });
        const isPasswordUpdated = await prisma.user.update({
          where: { id },
          data: {
            password: hashedPassword,
          },
        });
        if (!isPasswordUpdated) {
          throw createError(500, "Failed to update password.");
        }
        return {
          message: "Password updated successfully",
        };
      } catch (error) {
        throw error;
      }
    },
  },
};
