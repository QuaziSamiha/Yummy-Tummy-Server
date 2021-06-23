const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5050

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello Foodie! Experience Delicious Food')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jezdg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const customersCollection = client.db("FoodDelivery").collection("Customers");
  const reviewCollection = client.db("FoodDelivery").collection("customerReview");
  const serviceCollection = client.db("FoodDelivery").collection("addService");
  const adminCollection = client.db("FoodDelivery").collection("Admin");

  // adding food item from customer and store in database
  app.post('/addFoodOrder', (req, res) => {
    const newOrder = req.body;
    // console.log(newOrder);
    customersCollection.insertOne(newOrder)
      .then(result => {
        // console.log(result);
        res.send(result.insertedCount);
      })
  })

  // show food added to customer cart
  app.get('/customerOrderList', (req, res) => {
    // console.log(req.query.email);
    customersCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  app.get('/customerDetail', (req, res) => {
    customersCollection.find()
      .toArray((err, customerInfo) => {
        res.send(customerInfo)
      })
  })

  // post review from customer of food
  app.post('/postReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  // load customer review and display on home page review section
  app.get('/customerReviews', (req, res) => {
    reviewCollection.find()
      .toArray((err, reviews) => {
        res.send(reviews)
      })
  })

  app.post('/addNewService', (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/allServices', (req, res) => {
    serviceCollection.find()
      .toArray((err, services) => {
        res.send(services)
      })
  })

  app.delete('/deleteService/:id', (req, res) => {
    serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result);
      })
  })

  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
      .then(result => {
        res.send(result.insertedCount)
      })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admins) => {
        res.send(admins.length > 0)
      })
  })
});

app.listen(process.env.PORT || port)

// https://github.com/Porgramming-Hero-web-course/complete-website-server-QuaziSamiha

// collection name: Customers