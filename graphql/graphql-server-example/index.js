import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// Our Data 
import db from './_db.js'

import { typeDefs } from './schema.js'

const resolvers = {
    Query: {
        games() {
            return db.games
        },
        authors() {
            return db.authors
        },
        reviews() {
            return db.reviews
        },
	review(parent, args, context) {
	    return db.reviews.find((review) => review.id === args.id) 
	}
    }
}

// server setup
const server = new ApolloServer({

    // typeDefs - description of data types and relationships with other data types
    //          - kind of queries that can be made on this data
    //          - all that above combined to define a schema
    typeDefs,
    
    // resolvers - this makes the Queries part of GraphQL work
    //           - bunch of resolver functions that determine how we respond to queries for
    //           - different data on the graph
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log('Server ready at port', 4000);

// To run Apollo Server: node index.js  
// Now login to Apollo Explorer UI at http://localhost:4000
