import gql from "graphql-tag";

export const appointmentTypeDefs = gql`
  type Appointment {
    id: ID!
    name: String!
    email: String!
    phone: String!
    whatsapp: String
    preferredDate: String
    availableTime: String!
    emirate: String!
    area: String!
    hearAboutUs: String
    message: String
    shutterTypes: [String!]!
    createdAt: DateTime!
  }

  input CreateAppointmentInput {
    name: String!
    email: String!
    phone: String!
    whatsapp: String
    preferredDate: String!
    availableTime: String!
    emirate: String!
    area: String!
    hearAboutUs: String
    message: String
    shutterTypes: [String!]
    recaptchaToken: String
  }

  type Query {
    appointmentList: [Appointment!]!
    appointmentById(id: ID!): Appointment
  }

  type Mutation {
    createAppointment(input: CreateAppointmentInput!): GenericResponse!
  }
`;
