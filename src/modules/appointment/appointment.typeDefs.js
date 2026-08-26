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
    lead_source: String
    gclid: String
    fbclid: String
    msclkid: String
    ttclid: String
    epik: String
    ScCid: String
    li_fat_id: String
    twclid: String
    utm_source: String
    utm_medium: String
    utm_campaign: String
    utm_content: String
    utm_term: String
    utm_matchtype: String
    landing_referrer: String
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
    lead_source: String
    gclid: String
    fbclid: String
    msclkid: String
    ttclid: String
    epik: String
    ScCid: String
    li_fat_id: String
    twclid: String
    utm_source: String
    utm_medium: String
    utm_campaign: String
    utm_content: String
    utm_term: String
    utm_matchtype: String
    landing_referrer: String
  }

  type Query {
    appointmentList: [Appointment!]!
    appointmentById(id: ID!): Appointment
  }

  type Mutation {
    createAppointment(input: CreateAppointmentInput!): GenericResponse!
  }
`;
