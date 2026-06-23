import gql from "graphql-tag";

export const userTypeDefs = gql`


  input UpdateUser{
    name: String!
  }

  type Query {
    user: [User!]!
    userById(id: ID!): User
  }

  type Mutation {
    updateUserById(id: ID!, input: UpdateUser!): User
    removeUserById(id: ID!): User
  }
`;
