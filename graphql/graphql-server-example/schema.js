export const typeDefs = `#graphql
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
  }

  type Review {
    id: ID!
    rating: Int!
    content: String!
  }

  type Author {
    id: ID!
    name: String!
    verified: Boolean!
  }

  type Query {
    reviews: [Review]
    review(id: ID!): Review
    games: [Game]
    authors: [Author]
  }
`

// graphql types - int, float, string, boolean, ID
// ! means required

// type Query { .. } is an absolute must have
// which is basically what an end user can query from the Graph structure
