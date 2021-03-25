const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

// This is require for delete
const ObjectId = require('mongodb').ObjectId;

const pass = 'hxhxsrRJooXPNG$R';
const uri = "mongodb+srv://tushartd:hxhxsrRJooXPNG$R@cluster0.lq9rh.mongodb.net/organicdb?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// First product
// const honey = {
//   name: "Honey",
//   price: 300,
//   quantity: 20
// };


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("organicdb").collection("open");

  // Read something from the database
  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    } )
  })


  // Create or add something in the database

  // collection.insertOne(honey)
  // .then(res => {
  //   console.log('one product added')
  // })

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log('data added successfully');
      res.send('success');
    })
  });

  // Delete something from database
  app.delete('/delete/:id', (req, res) => {
    const product = ObjectId(req.params.id);
    productCollection.deleteOne({_id: product})
    .then((result) => {
      console.log(result);
      // res.send('delete');
    });
  });

  // Load single product
  app.get('/product/:id', (req, res) => {
    const product = ObjectId(req.params.id);
    productCollection.find({_id: product})
    .toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  // Update product
  app.patch('/update/:id', (req, res) => {
    console.log(req.body.price, req.body.quantity)
    const product = ObjectId(req.params.id);
    productCollection.updateOne(
      {_id: product},
      { $set: { price: req.body.price, quantity: req.body.quantity } }
    )
    .then((result) => {
      console.log(result);
    });
  });


  console.log('DB Connected');
  // perform actions on the collection object
  // client.close();
});


app.listen(3000);