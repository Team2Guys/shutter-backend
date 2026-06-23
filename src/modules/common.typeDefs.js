import gql from "graphql-tag";

export const commonTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String!
    subcategories: [Subcategory!]
    createdAt: String!
    updatedAt: String!
  }

  type Subcategory {
    id: ID!
    name: String!
    slug: String!
    description: String!
    category: Category
    createdAt: String!
    updatedAt: String!
  }
  type GenericResponse {
    message: String!
  }
`;
