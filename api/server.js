const { MongoClient } = require('mongodb');
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
require('dotenv').config({ path: 'API.env' });

let db;
const url = process.env.DB_URL;

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function productAdd(_, { Inputproduct }) {
  const count = await getNextSequence('products');
  const product = Inputproduct;
  product.id = count;
  const result = await db.collection('products').insertOne(product);
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
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
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

const app = express();
const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
console.log('CORS setting:', enableCors);
server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

const port = process.env.API_SERVER_PORT;
(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
