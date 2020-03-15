const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const { ApolloServer} = require('apollo-server-express');
const express = require('express');
let db; 

require('dotenv').config({ path: 'API.env' })
const url = process.env.DB_URL;
// const url = process.env.DB_URL || 'mongodb+srv://AS-user:cs648@cs648cluster-9hwpd.mongodb.net/Assignment4?retryWrites=true';

function productAdd(_, { product }) {
  product.id = productDB.length + 1;
  productDB.push(product);
  return product;
}

async function productList() {
  const products = await db.collection('products').find({}).toArray();
  return products;
}

const resolvers = {
  Query: {
    productList,
  },

  Mutation: {
    productAdd,
  },
};


async function connectToDb() { 
  console.log('URL: ', url);
  console.log('Port: ', process.env.API_SERVER_PORT);
  const client = new MongoClient(url, { useNewUrlParser: true , useUnifiedTopology: true});
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

const app = express();
server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.API_SERVER_PORT;
// const port = process.env.API_SERVER_PORT || 3000;

(async function () {
  try {
    await connectToDb();
    app.listen(port, function () {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();