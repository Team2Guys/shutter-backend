/**
 * Role-based permission keys. These exact strings are stored in
 * Admin.permissions[] and checked by verify.permission(...).
 * They mirror the permission keys used by the dashboard frontend.
 */
export const PERMISSIONS = {
  // Category
  ADD_CATEGORY: "canAddCategory",
  EDIT_CATEGORY: "canEditCategory",
  DELETE_CATEGORY: "canDeleteCategory",

  // Product
  ADD_PRODUCT: "canAddProduct",
  EDIT_PRODUCT: "canEditProduct",
  DELETE_PRODUCT: "canDeleteProduct",

  // Blog
  ADD_BLOG: "canAddBlog",
  EDIT_BLOG: "canEditBlog",
  DELETE_BLOG: "canDeleteBlog",

  // Appointment (view only — appointments cannot be deleted)
  VIEW_APPOINTMENTS: "canViewAppointments",

  // Contact (view only — contacts cannot be deleted)
  VIEW_CONTACTS: "canViewContacts",

  // Admin management
  VIEW_ADMINS: "canViewAdmins",
  ADD_ADMIN: "canAddAdmin",
  EDIT_ADMIN: "canEditAdmin",
  DELETE_ADMIN: "canDeleteAdmin",
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);
