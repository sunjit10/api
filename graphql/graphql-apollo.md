# graphql

## Sample App using Apollo Framework

Apollo Explorer -> GraphQL client that we run on the browser
NodeJS + Apollo Server (package) -> GraphQL server/backend

Each instance of Apollo Server spins up an instance of Apollo Explorer on our local machine that we can use to directly access it, typically at `http://localhost:4000`

### Env Setup

```
npm init --yes && npm pkg set type="module"
npm install @apollo/server graphql
```

Note: `type="module"` allows you to use ES6 modules

VS Code Extension: GraphQL Syntax Highlighting (from GraphQL Foundation)

### Demo

In your index.js file, import the Apollo Framework:

```
import { ApolloServer } from '@apollo/server'`
import { startStandaloneServer } from '@apollo/server/standalone'`
```

Initialize the Apollo Server and make it listen at port 4000

```
const server = new ApolloServer({
      // Specify your typeDefs and resolvers here
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})
```

Now you start the Apollo server using `node index.js` and access the Explorer at `http://localhost:4000`

### Schema

Create `schema.js` which specifies the Data and Relationships between Data (the Graph)

```
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

  ...
  type Query {
    reviews: [Review]
  }
`
```

- #graphql is optional, just used for syntax highlighting on vscode

- The most important is `type Query { ...}` which specifies the entry points to what is available for access in the Graph and its Return types. 
- `Every GraphQL Schema must have a Query type`
- This is where you define how your graph is accessible
- In the above example, the Query type only mentions Review, which means an external client can only access Review directly (cannot access Author or Game directly but on indirectly if they are linked to Review)
- Also, in the above example - a client cannot access a single Review but only a list of Reviews.




### Resolvers

Resolvers are what makes the queries possible.

We have the mocked up data in the file `_db.js` which is imported in the main index.js

You can see that `reviews` array inside it shows the dependency between a review and author/game.

For example:

```
 {id: '1', rating: 9, content: 'lorem ipsum', author_id: '1', game_id: '2'}
 ````

Now we define the resolvers as shown below:

```
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
        }
    }
}
```

The above matches what we have defined for `type Query`

```
  type Query {
    reviews: [Review]
    games: [Game]
    authors: [Author]
  }
```

Now you can access in Apollo Explorer and run queries like shown below. The interesting part is that the resolvers returns games but in query you can just ask for specific fields and the Apollo framework sorts that out for you.

```
query ExampleQuery {
  games {
    id,
    title
  }
}
```

And can combine multiples

```
query ExampleQuery {
  games {
    id,
    title
  }
  reviews {
    rating, 
    content
  }
}
```

### Query Variables

From the above example, we get the entire dataset for each entity vs the ability to query individual item.

To access a specific Review (single item), you would use `Query Variables`

This requires changes to the `type Query` so that it also accepts a single entry point, like ability to ask data for a specific review as well as a resolve function needs to be added that supports a specific review.

First: Changes to Query parameter:

```
type Query {
    reviews: [Review]
    review(id: ID!): Review
    games: [Game]
    authors: [Author]
  }
```
As shown above, the line that makes it work is `review(id: ID!): Review` 

The above allows you to return a single review for a given ID (and that ID cannot be null)

Next step: Updates to resolver to handle single id. Added this to index.js

```
review(parent, args, context) {
  return db.reviews.find((review) => review.id === args.id) 
}
```

Here, each resolver function gets 3 parameters which are:
- `parent` points to the parent resolver in the resolver chain. That is not used here.
- `args` are the arguments that we pass. This is where we can access query variables
- `context` used for supplying context value (ex: Auth info) throughout resolvers.



In Apollo Explorer, you would so something like:

```
query ExampleQuery($id: ID!) {
  review(id: $id) {
    rating, 
    content
  }
}
```

and in the Variables section, you provide the specific ID you want to access

```
{
  "id": "1"
}
```


### Related Data

Query in Apollo Explorer

```
query ExampleQuery($id: ID!) {
  game(id: $id) {
    title,
    platform
    reviews {
      rating,
      content
    }
  }
}  
```

To make that happen, `schema.js` was modified

Game had this line added
```
reviews: [Review!]
```

In the index.js, this was added
```
Game: {
  reviews(parent) {
    return db.reviews.filter((r) => r.game_id === parent.id)
  }
}
```

Similarly, you can add for Author

```
query ExampleQuery($id: ID!) {
  author(id: $id) {
    name
    reviews {
      rating,
      content
    }
  }
}
````

The above works because of this

```
Author: {
  reviews(parent) {
    return db.reviews.filter((r) => r.author_id === parent.id)
  }
}
```

plus `schema.js` additions to `type Author`


### Linking Other way

Now if you want to link the other way from Review to Games or Authors

```
query ReviewQuery($id: ID!) {
  review(id: $id) {
    rating,
    content
    game {
      title,
      platform
    }
  }
}
```

The last 2 lines were added to Review in schema file

```
type Review {
    id: ID!
    rating: Int!
    content: String!
    game: Game!
    author: Author!
  }
```

And the following in index.js

```
Review: {
  author(parent) {
    return db.authors.find((a) => a.id === parent.author_id)
  },
  game(parent) {
    return db.games.find((g) => g.id === parent.game_id)
  }
}

```