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