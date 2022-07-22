const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();
const mongoURI = process.env.mongoURI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDb connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/order', require('./routes/order'));

const server = app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})

