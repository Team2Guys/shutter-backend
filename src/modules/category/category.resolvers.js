import { validate, verify, handlePromise, PERMISSIONS } from "#lib/index.js";
import { categoryService } from "./category.service.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";

export const categoryResolvers = {
  Query: {
    categoryList: handlePromise(() => categoryService.list()),
    categoryById: handlePromise((_p, { id }) => categoryService.byId(id)),
    categoryByPath: handlePromise((_p, { path }) =>
      categoryService.byPath(path)
    ),
  },

  Mutation: {
    createCategory: handlePromise(
      verify.permission(PERMISSIONS.ADD_CATEGORY)((_p, { input }, ctx) => {
        const data = validate(createCategorySchema, input);
        return categoryService.create(data, ctx.user.name);
      })
    ),

    updateCategoryById: handlePromise(
      verify.permission(PERMISSIONS.EDIT_CATEGORY)((_p, { id, input }, ctx) => {
        const data = validate(updateCategorySchema, input);
        return categoryService.update(id, data, ctx.user.name);
      })
    ),

    removeCategoryById: handlePromise(
      verify.permission(PERMISSIONS.DELETE_CATEGORY)((_p, { id }) =>
        categoryService.remove(id)
      )
    ),
  },
};
