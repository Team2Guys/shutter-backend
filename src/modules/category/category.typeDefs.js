import gql from "graphql-tag";

export const categoryTypeDefs = gql`
  type Category {
    id: ID!
    name: String!
    description: String!
    breadcrumb: String!
    bannerImage: JSON
    path: String!
    posterImage: JSON
    metaTitle: String!
    metaDescription: String!
    canonicalUrl: String!
    seoSchema: String
    lastEditedBy: String!
    status: ContentStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
    products: [Product!]
    blogs: [Blog!]
  }

  input CreateCategoryInput {
    name: String!
    description: String!
    breadcrumb: String!
    bannerImage: JSON
    path: String
    posterImage: JSON
    metaTitle: String!
    metaDescription: String!
    canonicalUrl: String!
    seoSchema: String
    status: ContentStatus
  }

  input UpdateCategoryInput {
    name: String
    description: String
    breadcrumb: String
    bannerImage: JSON
    path: String
    posterImage: JSON
    metaTitle: String
    metaDescription: String
    canonicalUrl: String
    seoSchema: String
    status: ContentStatus
  }

  """
  One CSV row for bulk import. Images are intentionally excluded — imports never
  touch bannerImage/posterImage. When \`id\` matches an existing category the row
  is updated; otherwise a matching \`path\`/\`name\` is updated, else a new category
  is created.
  """
  input ImportCategoryInput {
    id: ID
    name: String
    description: String
    breadcrumb: String
    path: String
    metaTitle: String
    metaDescription: String
    canonicalUrl: String
    seoSchema: String
    status: ContentStatus
  }

  type Query {
    categoryList(published: Boolean): [Category!]!
    categoryById(id: ID!): Category
    categoryByPath(path: String!): Category
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): Category
    updateCategoryById(id: ID!, input: UpdateCategoryInput!): Category
    removeCategoryById(id: ID!): GenericResponse
    importCategories(input: [ImportCategoryInput!]!): ImportResult!
  }
`;
