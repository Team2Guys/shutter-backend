import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

import { commonTypeDefs, commonResolvers } from "./common.js";
import { authTypeDefs, authResolvers } from "./auth/index.js";
import { adminTypeDefs, adminResolvers } from "./admin/index.js";
import { categoryTypeDefs, categoryResolvers } from "./category/index.js";
import { productTypeDefs, productResolvers } from "./product/index.js";
import { blogTypeDefs, blogResolvers } from "./blog/index.js";
import { appointmentTypeDefs, appointmentResolvers } from "./appointment/index.js";
import { contactTypeDefs, contactResolvers } from "./contact/index.js";

export const typeDefs = mergeTypeDefs([
  commonTypeDefs,
  authTypeDefs,
  adminTypeDefs,
  categoryTypeDefs,
  productTypeDefs,
  blogTypeDefs,
  appointmentTypeDefs,
  contactTypeDefs,
]);

export const resolvers = mergeResolvers([
  commonResolvers,
  authResolvers,
  adminResolvers,
  categoryResolvers,
  productResolvers,
  blogResolvers,
  appointmentResolvers,
  contactResolvers,
]);
