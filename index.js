const express = require("express")
const cors = require("cors")
const mongodb = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config()
const corsOptions = {
  origin: ['https://66c05811b5731c3071cdbfc5--iridescent-cucurucho-46ae70.netlify.app'],
  credentials: true,
  optionSuccessStatus: 200,
}

// middleware
app.use(cors(corsOptions))
app.use(express.json())



// mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASSWORD}@cluster0.iagloem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version


// ecommerce
// cXwnbkw6PoUvc1GF

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    const allProduct = client.db("ecommerces").collection("products");


    app.get("/populardata", async (req, res) => {
      const { sort } = req?.query;
      const query = {}; 
      const options = {
        new_price : sort === "asc" ? 1 : -1
      }
      const result = await allProduct.find(query, options).toArray()
      res.send(result)
    })


    app.get("/kidscollection", async (req,res) => {
      const {filter} = req?.query;
      const query = {category : filter};
      const result = await allProduct.find(query).toArray()
      // console.log(result)
      // console.log(filter)
      res.send(result)
    })


    app.get("/productcount", async(req,res) => {
      const count = await allProduct.estimatedDocumentCount()
      res.send({count})
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error


  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
