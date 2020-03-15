require('dotenv').config({ path: 'UI.env' })

const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(process.env.UI_SERVER_PORT, function () {
  console.log(`UI started on port ${process.env.UI_SERVER_PORT}`);
});