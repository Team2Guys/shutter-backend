import createError from "http-errors";
import { sendEmail, prisma, tokenUtils } from "#lib/index.js";

export const emailResolvers = {
  Mutation: {
    checkVerificationToken: async (_parent, { input }) => {
      const { verificationToken } = input;

      if (!verificationToken)
        throw createError(400, "Verification token is required.");

      const decodedToken = tokenUtils.verify(verificationToken);

      const { id } = decodedToken;
      if (!id) throw createError(400, "Invalid verification token.");

      const isUserUpdate = await prisma.user.update({
        where: { id },
        data: { isEmailVerified: true },
      });

      if (!isUserUpdate) throw createError(500, "Failed to update user.");

      return { message: "Email verified successfully." };
    },

    
    sendVerificationToken: async (_parent, { input }) => {
      const { email } = input;
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) throw createError(404, "User dows not exist");
      const verificationToken = tokenUtils.generate(
        { id: user.id },
        "verificationToken"
      );
      const sentEmail = await sendEmail("verification-email", {
        email: email,
        subject: "Welcome - Verify your email",
        FRONTEND_URL,
        verificationToken,
      });
      if (!sentEmail)
        throw createError(500, "Failed to send verification email.");

      return { message: "Verification email sent successfully." };
    },
  },
};
