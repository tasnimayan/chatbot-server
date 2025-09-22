# Graphql Chatbot Server with Graphql API

This is a Graphql chatbot server which provides a Graphql API for managing chatbot conversations. It uses Apollo server to provide a Graphql API. The Graphql API allows clients to create, read, update and delete chatbot conversations.

## Getting Started

To get started, follow these steps:

1. Clone the repository
2. Install the dependencies by running `npm install`
3. Start the server by running `npm start`

## Usage

To use the chatbot server, you can send Graphql queries to `http://localhost:8000/graphql`. The server supports the following queries:

- `nodes`: Retrieves all nodes.
- `node`: Retrieves a specific node by ID.
- `createNode`: Creates a new node.
- `updateNode`: Updates an existing node.
- `deleteNode`: Deletes a node.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
