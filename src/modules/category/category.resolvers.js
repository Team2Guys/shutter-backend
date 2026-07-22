import { validate, verify, handlePromise, PERMISSIONS } from "#lib/index.js";
import { categoryService } from "./category.service.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";

export const categoryResolvers = {
  Query: {
    // Public (no auth) sees only PUBLISHED; an authenticated admin sees all.
    categoryList: handlePromise((_p, { published }, ctx) =>
      categoryService.list(published === true || !ctx.user)
    ),
    categoryById: handlePromise((_p, { id }) => categoryService.byId(id)),
    categoryByPath: handlePromise((_p, { path }, ctx) =>
      categoryService.byPath(path, !ctx.user)
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

    // Bulk CSV import. Editing existing rows needs EDIT_CATEGORY; rows that would
    // create a brand-new category additionally require ADD_CATEGORY.
    importCategories: handlePromise(
      verify.permission(PERMISSIONS.EDIT_CATEGORY)((_p, { input }, ctx) => {
        const canCreate =
          ctx.user.role === "SUPER_ADMIN" ||
          (ctx.user.permissions || []).includes(PERMISSIONS.ADD_CATEGORY);
        return categoryService.importMany(input, ctx.user.name, canCreate);
      })
    ),
  },
};
