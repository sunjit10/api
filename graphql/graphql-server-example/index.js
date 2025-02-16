import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// Our Data 
import db from './_db.js'

// typeDefs contain the Schema 
import { typeDefs } from './schema.js'

// resolvers take care of the queries
const resolvers = {
    Query: {
        games() {
            return db.games
        },
        game(parent, args, context) {
	        return db.games.find((game) => game.id === args.id) 
	    },
        authors() {
            return db.authors
        },
        author(parent, args, context) {
	        return db.authors.find((author) => author.id === args.id) 
	    },
        reviews() {
            return db.reviews
        },
	    review(parent, args, context) {
	        return db.reviews.find((review) => review.id === args.id) 
	    }
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter((r) => r.game_id === parent.id)
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter((r) => r.author_id === parent.id)
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
