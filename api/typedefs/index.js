module.exports = {
  typeDefs: `
 
 type User {
    username: String
    supervisorId: ID
    active: Boolean
    createdBy: ID
    createdDate: String
    profile: [Profile]
    auth: [Auth]
  }

  type Auth{
    passwords: [Password]!
    roles: ID!
    loginAttempts: [LoginAttempt]!
  }

  type Password{
    password: String!
    question: String!
    answer: String!
    hint: String!
    createdDate: String!
    createdById: ID!
    prev: Password
    next: Password
  }

  type LoginAttempt{
    status: Boolean!
    password: String!
    ipAddress: String
    browserType: String
    attemptDate: String!
    prev: LoginAttempt
  }

  type Profile{
    firstName: String!
    middleName: String
    lastName: String
    photo: File
    phoneNumber: [Int]!
    emailId: String!
    bio: String
    gender: String!
    religion: String!
    category: String!
    nationality: String!
    dateOfBirth: String!
    address: [Address]!
    father: FamilyMember
    mother: FamilyMember
    collegeEnroll: ID!
  }

  type Address{
    type: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    pincode: Int!
    state: ID!
    country: ID!
  }

  type FamilyMember{
    name: String!
    occupation: String!
    phoneNumber: [Int]!
    age: Int
    address: [Address]!
    certificates: [Certificate]!
  }

  type Certificate{
    name: String
    identificationType: String!
    identificationId: String!
    files: [File]!
    required: Boolean
    humanVerified: Boolean
    humanVerifiedId: ID!
  }

  type File{
    url: String!
    size: Int
    createdDate: String!
    prev: [File]
    next: [File]
  }

  type Token{
    key: String!
  }

  type Query {
    user: [User]
  }

  type Mutation{
    register(username: String!, password: String!, question: String, answer: String, hint: String): [Token]
    login(username: String!, password: String!): String!
  }
  `
}