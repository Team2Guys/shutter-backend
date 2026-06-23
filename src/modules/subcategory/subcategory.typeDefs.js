import gql from "graphql-tag";

export const subcategoryTypeDefs = gql`
  input CreateSubcategory {
    name: String!
    slug: String!
    description: String!
    categoryId: String!
  }

  input UpdateSubcategory {
    name: String!
    slug: String!
    description: String!
    categoryId: String
  }
  input GetCategoryBySlugInput {
    slug: String!
  }

  type Query {
    subcategory: [Subcategory!]!
    subcategoryById(id: ID!): Subcategory
    subcategoryBySlug(slug: String!): Subcategory
  }

  type Mutation {
    createSubcategory(input: CreateSubcategory!): GenericResponse
    updateSubcategoryById(id: ID!, input: UpdateSubcategory!): GenericResponse
    removeSubcategoryById(id: ID!): GenericResponse
  }
`;
