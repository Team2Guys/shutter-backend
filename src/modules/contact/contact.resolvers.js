import {
  validate,
  verify,
  verifyRecaptcha,
  handlePromise,
  PERMISSIONS,
} from "#lib/index.js";
import { contactService } from "./contact.service.js";
import { createContactSchema } from "./contact.validation.js";

export const contactResolvers = {
  Query: {
    contactList: handlePromise(
      verify.permission(PERMISSIONS.VIEW_CONTACTS)(() => contactService.list())
    ),
    contactById: handlePromise(
      verify.permission(PERMISSIONS.VIEW_CONTACTS)((_p, { id }) =>
        contactService.byId(id)
      )
    ),
  },

  Mutation: {
    // Public: submitted from the website contact form.
    createContact: handlePromise(async (_p, { input }) => {
      const { recaptchaToken, ...rest } = input;
      await verifyRecaptcha(recaptchaToken);
      const data = validate(createContactSchema, rest);
      await contactService.create(data);
      return {
        success: true,
        message: "Thank you! Your message has been sent. We'll be in touch soon.",
      };
    }),
  },
};
