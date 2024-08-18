const express = require("express")
const cors = require("cors")
const mongodb = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config()



const corsOptions = {
  origin: [ "http://localhost:5173"],
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
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const search = req.query.search || "";
      const sort = req.query.sort || "";
      const filterBrand = req.query.filterBrand || "";
      const filterCate = req.query.filterCate || "";
      const filterRange = req.query.filterRange || "";

      console.log(req.query);

      // Initialize the query object
      const query = {
        name: {
          $regex: search,
          $options: "i"
        }
      };

      // Apply filters if they exist
      if (filterBrand) {
        query.brand_name = filterBrand;
      }
      if (filterRange) {
        console.log(filterRange)
        const [minPrice, maxPrice] = filterRange.split("-").map(Number);

        query.new_price = {
          $gte: minPrice,
          $lte: maxPrice
        };
      }
      if (filterCate) {
        query.category = filterCate;
      }

      let apiData = allProduct.find(query).skip(page * size).limit(size);

      // Apply sorting based on the `sort` parameter
      if (sort === "priceHighToLow") {
        apiData = apiData.sort({ "new_price": -1 }); // Sort by price descending
      } else if (sort === "priceLowToHigh") {
        apiData = apiData.sort({ "new_price": 1 }); // Sort by price ascending
      } else if (sort === "newestDate") {
        apiData = apiData.sort({ "creation_date_time": -1 }); // Sort by newest date first
      }

      try {
        const result = await apiData.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
      }
    });


    app.get("/kidscollection", async (req, res) => {
      const { filter } = req?.query;
      const query = { category: filter };
      const result = await allProduct.find(query).toArray()
      // console.log(result)
      // console.log(filter)
      res.send(result)
    })


    app.get("/productcount", async (req, res) => {
      const count = await allProduct.estimatedDocumentCount()
      res.send({ count })
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
