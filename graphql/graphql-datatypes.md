
GraphQL has following Data Types: 
  - Integer
  - Float
  - String
  - Boolean
  - ID

- ID! means ID is a required field (The ! means required)
  - Ex: authorid: ID!
  - If it was: authorid: ID   then it means that authorid can be null
- ID is used as a key for data objects
- [String] means an array of Strings
  - Ex: cities: [String]
  - Ex: cities: [String]!  then it means cities is an array but each element can be null
  - Ex: cities: [String!]! then it means cities is an array, each element cannot be null
