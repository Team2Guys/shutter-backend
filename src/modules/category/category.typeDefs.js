import gql from "graphql-tag";

export const categoryTypeDefs = gql`
  input CreateCategory {
    name: String!
    slug: String!
    description: String!
  }

  input UpdateCategory {
    name: String!
    slug: String!
    description: String!
  }

  type Query {
    category: [Category!]!
    categoryById(id: ID!): Category
  }

  type Mutation {
    createCategory(input: CreateCategory!): Category
    updateCategoryById(id: ID!, input: UpdateCategory!): Category
    removeCategoryById(id: ID!): GenericResponse
  }
`;
