# Graphql Chatbot Server with Graphql API

This is a Graphql chatbot server which provides a Graphql API for managing chatbot configurations. It uses Apollo server to provide a Graphql API. The Graphql API allows read chatbot conversations data from storage.

## Features

- 🚀 Apollo Server with Express (v5.x)
- 📘 Full TypeScript support
- 🔐 JWT Bearer Token Authentication
- 🔍 Nested GraphQL Relationships
- ⚡ Error Handling & Validation

## Getting Started

To get started, follow these steps:

1. Clone the repository
2. Install the dependencies by running `npm install`
3. Start the development server by running `npm run dev`
4. To build and run for production `npm run start:prod`

## Usage

### Generating an Authentication Token

To interact with the GraphQL API, you must first obtain a JWT auth token. Follow these steps:

1. **Send a POST request** to the following endpoint:

   ```
   http://localhost:8000/auth/generate-token
   ```

2. **Include the following HTTP header** in your request:

   ```
   X-API-KEY: <your API_KEY from environment variables>
   ```

3. **Provide a JSON body** with your user information. Example:

   ```json
   {
     "name": "John Doe",
     "permissions": ["read", "write"]
   }
   ```

   - The `name` field is required.
   - The `permissions` field is optional. If omitted, it defaults to `["read"]`.

4. **On success**, the response will include a JWT token and user details. Use this token for authenticating your GraphQL requests.

## Authentication

To use the chatbot server, you can send Graphql queries to `http://localhost:8000/graphql`. All GraphQL queries require a valid Bearer token in the Authorization header:

**Include the following header** in your HTTP POST request:

```
Authorization: Bearer <jwt token generated previously>
```

## Example GraphQL Queries

### Get a Single Node with All Relationships

```graphql
query GetNode($nodeId: ID!) {
  node(nodeId: $nodeId) {
    _id
    name
    description
    createdAt
    updatedAt
    root
    global
    colour
    priority

    # Parent relationships
    parents {
      _id
      name
      description
    }

    # Trigger relationship
    trigger {
      _id
      name
      description
      functionString
      resourceTemplate {
        _id
        name
        schema
        key
      }
    }

    # Response relationships
    responses {
      _id
      name
      description
      platforms {
        integrationId
        build
        localeGroups {
          localeGroupId
          variations {
            name
            responses
          }
        }
      }
    }

    # Action relationships
    actions {
      _id
      name
      description
      functionString
      resourceTemplate {
        _id
        name
        schema
        key
      }
    }
  }
}
```

**Variables:**

```json
{
  "nodeId": String!
}
```

### Get All Nodes (Basic Info)

```graphql
query GetAllNodes {
  nodes {
    _id
    name
    description
    root
    global
    colour
    priority
  }
}
```

## Testing with curl

### Basic Authentication Test

```bash
curl -X POST http://localhost:8000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <provide_your_jwt_token>" \
  -d '{"query": "{ nodes { _id name description } }"}'
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
