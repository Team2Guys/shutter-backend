import gql from "graphql-tag";

export const productTypeDefs = gql`
  type Product {
    id: ID!
    categoryId: ID!
    name: String!
    description: String!
    breadcrumb: String!
    bannerImage: JSON
    path: String!
    posterImage: JSON
    firstImage: JSON
    firstHeading: String!
    firstSubTitle: String!
    firstDescription: String!
    secondImage: JSON
    secondHeading: String!
    secondSubTitle: String!
    secondDescription: String!
    imageHeading: String
    productImages: [JSON!]
    faq: [JSON!]
    metaTitle: String
    metaDescription: String
    canonicalUrl: String
    seoSchema: String
    lastEditedBy: String!
    status: ContentStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
    category: Category
  }

  input CreateProductInput {
    categoryId: ID!
    name: String!
    description: String!
    breadcrumb: String!
    bannerImage: JSON
    path: String
    posterImage: JSON
    firstImage: JSON
    firstHeading: String!
    firstSubTitle: String!
    firstDescription: String!
    secondImage: JSON
    secondHeading: String!
    secondSubTitle: String!
    secondDescription: String!
    imageHeading: String
    productImages: [JSON!]
    faq: [JSON!]
    metaTitle: String
    metaDescription: String
    canonicalUrl: String
    seoSchema: String
    status: ContentStatus
  }

  input UpdateProductInput {
    categoryId: ID
    name: String
    description: String
    breadcrumb: String
    bannerImage: JSON
    path: String
    posterImage: JSON
    firstImage: JSON
    firstHeading: String
    firstSubTitle: String
    firstDescription: String
    secondImage: JSON
    secondHeading: String
    secondSubTitle: String
    secondDescription: String
    imageHeading: String
    productImages: [JSON!]
    faq: [JSON!]
    metaTitle: String
    metaDescription: String
    canonicalUrl: String
    seoSchema: String
    status: ContentStatus
  }

  """
  One CSV row for bulk import. Images are excluded. \`category\` accepts a
  category name or path; when \`id\` matches an existing product it is updated,
  otherwise a matching \`path\` is updated, else a new product is created.
  """
  input ImportProductInput {
    id: ID
    categoryId: ID
    category: String
    name: String
    description: String
    breadcrumb: String
    path: String
    firstHeading: String
    firstSubTitle: String
    firstDescription: String
    secondHeading: String
    secondSubTitle: String
    secondDescription: String
    imageHeading: String
    faq: [JSON!]
    metaTitle: String
    metaDescription: String
    canonicalUrl: String
    seoSchema: String
    status: ContentStatus
  }

  type Query {
    productList(published: Boolean): [Product!]!
    productById(id: ID!): Product
    productByPath(path: String!): Product
    productsByCategory(categoryId: ID!): [Product!]!
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product
    updateProductById(id: ID!, input: UpdateProductInput!): Product
    removeProductById(id: ID!): GenericResponse
    importProducts(input: [ImportProductInput!]!): ImportResult!
  }
`;
