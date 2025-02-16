import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// server setup
const server = new ApolloServer({

    // typeDefs - description of data types and relationships with other data types
    //          - kind of queries that can be made on this data
    //          - all that above combined to define a schema

    
    // resolvers - bunch of resolver functions that determine how we respond to queries for
    //           - different data on the graph
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log('Server ready at port', 4000);
