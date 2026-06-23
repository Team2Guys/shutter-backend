import gql from "graphql-tag";

export const emailTypeDefs = gql`
    input CheckVerificationTokenInput {
        verificationToken : String!
    }
    
    input SendVerificationEmailInput {
        email: String!
    }

    type Mutation {
        checkVerificationToken(input: CheckVerificationTokenInput!): GenericResponse
        sendVerificationToken(input: SendVerificationEmailInput!): GenericResponse
    }
`;