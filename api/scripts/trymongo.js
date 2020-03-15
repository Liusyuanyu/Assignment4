const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://AS-user:cs648@cs648cluster-9hwpd.mongodb.net/Assignment4?retryWrites=true';

// mongo "mongodb+srv://cs648cluster-9hwpd.mongodb.net/test"  --username AS-user
// mongodb+srv://AS-user:cs648@cs648cluster-9hwpd.mongodb.net/test

function testWithCallbacks(callback) {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true,useUnifiedTopology: true});
  client.connect(function(err, client) {
    if (err) {
      callback(err);
      return;
    }
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('products');

    // id: 1, Name: 'Blue Shirt',Price: '16.99', 
    // Category: 'Shirts', Image: 'https://images.app.goo.gl/A1VVdgNYDBFprrow5',

    const product = { id: 1, Name: 'A test shirt', Price: '5.8', Category:'Shirts', Image:'www.google.com' };
    collection.insertOne(product, function(err, result) {
      if (err) {
        client.close();
        callback(err);
        return;
      }
      console.log('Result of insert:\n', result.insertedId);
      collection.find({ _id: result.insertedId})
        .toArray(function(err, docs) {
        if (err) {
          client.close();
          callback(err);
          return;
        }
        console.log('Result of find:\n', docs);
        client.close();
        callback(err);
      });
    });
  });
}

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const collection = db.collection('products');

    // const employee = { id: 2, name: 'B. Async', age: 16 };
    const product = { id: 2, Name: 'A test pants', Price: '15.8', Category:'Pants', Image:'www.google.com' };
    const result = await collection.insertOne(product);
    console.log('Result of insert:\n', result.insertedId);

    const docs = await collection.find({ _id: result.insertedId })
      .toArray();
    console.log('Result of find:\n', docs);
  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}

testWithCallbacks(function(err) {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});
