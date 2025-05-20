## Drawbacks of REST API

### Overfetching

This is when we get more data from a REST endpoint than we actually need. 
Ex:
GET mysite.com/api/courses

Above GET call returns all the courses in JSON format.
Each course can have multiple properties like id, title, author, price, popularity, viewcount, URL etc

Let's say we only care of id, title and URL. We don't care about the remaining data. We are unnecessary fetching other fields multiplied that for each course (we could have 100s of courses)


### Undefetching

We don't get all data in a single REST call and we have to make multiple REST calls to potentially multiple endpoints and stitch that together to get the final data that is required.

Taking the same example as above (for a specific course)
GET mysite.com/api/courses/1

Above GET call returns all the courses in JSON format.
Each course can have multiple properties like id, title, author, price, URL etc

Now we want to get all the courses from the same author. In this case we have to make another REST call, this time using the author info to ask a different endpoint on all the courses offered by that author.

GET mysite.com/api/courses/1
GET mysite.com/api/authors/234


## GraphQL to the rescue

GraphQL solves the overfetching and underfetching issues mentioned above.
With RESTAPI, the calls would typically be:

GET mysite.com/api/courses/1

With graphql, it is abstracted and you would have:

mysite.com/graphql 

### Query to fetch EXACTLY what you need

You would typically not have detailed endpoints like you do with REST APIs.

If we wanted the courses data (as shown in `Overfetching` in REST APIs), you will still call mysite.com/graphql and pass a Query parameter to specify EXACTLY what you need:

```
Query {
  courses {
    id,
    title,
    url
  }
}
```

### Nested Queries to make a single call

For example show in `Underfetching` where multiple REST API calls had to be made to get what we need, you can have `Nested` Query parameter in a single call.

```
Query {
    course(id: "1") {
        id,
        title,
        url,
        author {
            name, 
            id,
            courses {
                id,
                title,
                url
            }
        }
    }
}
```

### Mutations

Mutations === modifications to data (not only just fetch it) and this includes inserts/updates/deletes to the data. 


## GraphQL Syntax

```
query ReviewsQuery {
    reviews {

    }
}
```

In GraphQL, you can `name your query` (example: ReviewsQuery). This is optional but recommended.

Next, provide a `Resoure name` (example: reviews) which tells you what type of Resource you want to fetch from the backend. 

Next, you tell exactly which fields would you like to fetch. This is how GraphQL is better than REST, you can be specific and avoid overfetching.

```
query ReviewsQuery {
    reviews {
        rating,
        content,
        id
    }
}
```

Nested calls - you can fetch data from more than one resources by making use of Nested queries.

```
query {
    reviews {
        rating,
        content,
        author {
            name
        }
    }
}
```

In the above example, we are fetching from two different resources (reviews and author) in a single query (vs sending multiple queries in REST API)

### Query variables

If you are interested to fetch for a specific entity, example I want to fetch only for game with id as "2", you would use the syntax below

```
query {
    game(id: "2") {
        title,
        review {
            rating,
            author {
                name
            }
        },
}
```

As shown above, you are making a single query but fetching data from 3 different resources (game, review and author). You are fetching only for game id=2 and only fetching specific fields from other resources.


### Mutations - Add/Update/Delete

Below is an example of an Mutation that adds a new game:

```
mutation AddMutation($game: AddGameInput!) {
    addGame(game: $game) {
        id,
        title,
        platform
    }
}
```