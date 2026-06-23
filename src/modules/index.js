import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDefs, userResolvers } from "./user/index.js";
import { commonTypeDefs } from "./common.typeDefs.js";
import { authTypeDefs, authResolvers } from "./auth/index.js";
import { categoryTypeDefs, categoryResolvers } from "./category/index.js";
import {
  subcategoryTypeDefs,
  subcategoryResolvers,
} from "./subcategory/index.js";
import { emailTypeDefs, emailResolvers } from "./email/index.js";

export const typeDefs = mergeTypeDefs([
  userTypeDefs,
  commonTypeDefs,
  authTypeDefs,
  categoryTypeDefs,
  subcategoryTypeDefs,
  emailTypeDefs,
]);
export const resolvers = mergeResolvers([
  userResolvers,
  authResolvers,
  categoryResolvers,
  subcategoryResolvers,
  emailResolvers,
]);
