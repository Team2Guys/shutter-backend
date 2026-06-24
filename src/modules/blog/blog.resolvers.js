import { validate, verify, handlePromise, PERMISSIONS } from "#lib/index.js";
import { blogService } from "./blog.service.js";
import { createBlogSchema, updateBlogSchema } from "./blog.validation.js";

export const blogResolvers = {
  Query: {
    blogList: handlePromise(() => blogService.list()),
    blogById: handlePromise((_p, { id }) => blogService.byId(id)),
    blogByPath: handlePromise((_p, { path }) => blogService.byPath(path)),
    blogsByCategory: handlePromise((_p, { categoryId }) =>
      blogService.byCategory(categoryId)
    ),
  },

  Mutation: {
    createBlog: handlePromise(
      verify.permission(PERMISSIONS.ADD_BLOG)((_p, { input }, ctx) => {
        const data = validate(createBlogSchema, input);
        return blogService.create(data, ctx.user.name);
      })
    ),

    updateBlogById: handlePromise(
      verify.permission(PERMISSIONS.EDIT_BLOG)((_p, { id, input }, ctx) => {
        const data = validate(updateBlogSchema, input);
        return blogService.update(id, data, ctx.user.name);
      })
    ),

    removeBlogById: handlePromise(
      verify.permission(PERMISSIONS.DELETE_BLOG)((_p, { id }) =>
        blogService.remove(id)
      )
    ),
  },
};
