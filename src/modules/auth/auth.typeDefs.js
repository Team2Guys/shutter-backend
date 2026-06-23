import gql from "graphql-tag";

export const authTypeDefs = gql`
  enum Role {
    USER
    ADMIN
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
    role: Role!
  }

  input PasswordResetRequestInput {
    email: String!
  }

  input PasswordUpdateInput {
    password: String!
    resetToken: String!
  }

  input SigninInput {
    email: String!
    password: String!
    role: Role!
  }

  type SigninResponse {
    id: String!
    name: String!
    email: String!
    role: Role!
    accessToken: String!
  }

  type SignUpGenericResponse {
    message: String!
    verificationToken: String
  }

  type ResetResponse {
    message: String!
    resetToken: String
  }

  type Mutation {
    signUp(input: SignupInput!): SignUpGenericResponse
    signIn(input: SigninInput!): SigninResponse
    signOut: GenericResponse
    passwordResetRequest(input: PasswordResetRequestInput!): ResetResponse
    updatePassword(input: PasswordUpdateInput!): GenericResponse
  }
`;
