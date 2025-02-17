# graphql

## Sample App using Apollo Framework

### Env Setup

```
npm init --yes && npm pkg set type="module"
npm install @apollo/server graphql
```

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
  ...
  type Query {
    reviews: [Review]
  }
`
```

- GraphQL has following Data Types: Integer, Float, String, Boolean, ID
- ID! means ID is a required field (The ! means required)
- #graphql is optional, just used for syntax highlighting on vscode
- The most important is `type Query { ...}` which specifies the entry points to what is available for access


### Resolvers

Resolvers are what makes the queries possible.

We have the mocked up data in the file `_db.js` which is imported in the main index.js

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

Now you can access in Apollo Explorer and run queries like

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

To access a specific Review (single item), you would modify

```
type Query {
    reviews: [Review]
    review(id: ID!): Review
    games: [Game]
    authors: [Author]
  }
```
As shown above, the line that makes it work is `review(id: ID!): Review` 

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

Finally, Added this to index.js

```
review(parent, args, context) {
  return db.reviews.find((review) => review.id === args.id) 
}
```
Here, each resolver function gets 3 parameters which are:
- `parent` points to the parent resolver in the resolver chain. That is not used here.
- `args` are the arguments that we pass. This is where we can access query variables
- `context` used for supplying context value (ex: Auth info) throughout resolvers.


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