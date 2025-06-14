# stepzen

stepzen login us-east-a.ibm.stepzen.net -a zarqanak -k zarqanak::local.io+1000::5ee41d3ee80305d72fd50b96c75e7d2f0e9f2be024c3d7030d4a9b2f112818ab

```
> stepzen import curl "https://introspection.apis.stepzen.com/customers"
? What would you like your endpoint to be called? api/product-demo
Starting... done
Successfully imported curl data source into your GraphQL schema
```

This created the following structure:

- stepzen.config.json
- index.graphql
- Directory curl
- File curl/index.graphql


Contents of stepzen.config.json

```
{
  "endpoint": "api/product-demo"
}
```

index.graphql 

```
schema @sdl(files: ["curl/index.graphql"]) {
  query: Query
}
```

curl/index.graphql

```
type Address {
  city: String
  countryRegion: String
  id: Int
  postalCode: String
  stateProvince: String
  street: String
}

type OrdersEntry {
  carrier: String
  createdAt: Date
  customerId: Int
  id: Int
  shippingCost: Int
  trackingId: String
}

type RootEntry {
  address: Address
  email: String
  id: Int
  name: String
  orders: [OrdersEntry]
}

type Query {
  myQuery: [RootEntry]
    @rest(endpoint: "https://introspection.apis.stepzen.com/customers")
}

```


Example 2:
stepzen import curl "https://introspection.apis.stepzen.com/orders" --query-name "orders" --query-type "Order"

Now a new directory called curl-01 got created

Contents of stepzen.config.json remained unchanged

```
{
  "endpoint": "api/product-demo"
}
```

Contents of top level index.graphql

```
schema @sdl(files: ["curl/index.graphql", "curl-01/index.graphql"]) {
  query: Query
}
```

contents of curl-01/index.graphql

```
type OrderEntry {
  carrier: String
  createdAt: Date
  customerId: Int
  id: Int
  shippingCost: Int
  trackingId: String
}

type Query {
  orders: [OrderEntry]
    @rest(endpoint: "https://introspection.apis.stepzen.com/orders")
}
```

Now that we have 2 APIs, we deploy the APIs using `stepzen start`

```
stepzen start
Deploying api/product-demo to StepZen... done in 326ms 🚀
  ✓ 🔐 https://zarqanak.us-east-a.ibm.stepzen.net/api/product-demo/__graphql
  ✓ 🔐 wss://zarqanak.us-east-a.ibm.stepzen.net/stepzen-subscriptions/api/product-demo/__graphql (subscriptions)

You can test your hosted API with curl:

curl https://zarqanak.us-east-a.ibm.stepzen.net/api/product-demo/__graphql \
   --header "Authorization: Apikey $(stepzen whoami --apikey)" \
   --header "Content-Type: application/json" \
   --data-raw '{
     "query": "query SampleQuery { __schema { description queryType { fields {name} } } }"
   }'

Or explore it with GraphiQL at
   http://localhost:5001/api/product-demo


Watching ~/dev/api/stepzen for changes...
```

As you can see, you get couple of endpoints:
- https://zarqanak.us-east-a.ibm.stepzen.net/api/product-demo/__graphql
- http://localhost:5001/api/product-demo



### SmallRye

https://quarkus.io/guides/smallrye-graphql

quarkus create app org.acme:microprofile-graphql-quickstart \
    --extension='quarkus-smallrye-graphql' \
    --no-code
cd microprofile-graphql-quickstart


quarkus extension add quarkus-smallrye-graphql




