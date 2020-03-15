/* global db print */
/* eslint no-restricted-globals: "off" */

db.products.remove({});

// mongo mongodb+srv://AS-user:csSixFourEight@cs648cluster-9hwpd.mongodb.net/Assignment4 scripts/init.mongo.js
// mongo mongodb+srv://AS-user:cs648@cs648cluster-9hwpd.mongodb.net/Assignment4 scripts/init.mongo.js

const productDB = [
  {
    id: 1,
    Name: 'Blue Shirt',
    Price: '16.99',
    Category: 'Shirts',
    Image: 'https://images.app.goo.gl/A1VVdgNYDBFprrow5',
  },
  {
    id: 2,
    Name: 'Logo Hat',
    Price: '12.99',
    Category: 'Accessories',
    Image: 'https://images.app.goo.gl/bBjLavbRvs7DJtpu8',
  },
  {
    id: 3,
    Name: 'Regular Fit Jeans',
    Price: '34.99',
    Category: 'Jeans',
    Image: 'https://images.app.goo.gl/ALG2aDEKpPxGV9137',
  },
];

db.products.insertMany(productDB);
const count = db.products.count();
print('Inserted', count, 'products');

db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });

db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ Name: 1 });
db.products.createIndex({ Price: 1 });
db.products.createIndex({ Categories: 1 });
