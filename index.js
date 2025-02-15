const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//MIDDLEWARE
app.use(cors());
app.use(express.json());

// Avishek Roy JbDmmHI7BojprzkP




// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.hauko36.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dop0c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dop0c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        //created a collection named 'items'
        const itemCollection = client.db('itemsDB').collection('items');
        const passwordCollection = client.db('itemsDB').collection('passwords');
        //created a collection named 'categories' under same database
        const categoriesCollection = client.db('itemsDB').collection('categories');

        //added post method for inserting data
        app.post('/items', async (req, res) => {
            const addedItem = req.body;
            // console.log(addedItem);
            const result = await itemCollection.insertOne(addedItem);
            res.send(result)
        });

        //get all the data
        app.get('/items', async (req, res) => {
            const cursor = itemCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/save', async (req, res) => {
            const addedItem = req.body;
            console.log('----------------------HITTED--------------------');
            const result = await passwordCollection.insertOne(addedItem);
            res.send(result)
        })
        app.get('/save/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { user_email: email }
            const result = await passwordCollection.find(query).toArray()
            res.send(result)
        })

        app.get('test', (req, res)=>{
            console.log('test hit')
        })

        // access data by user id
        app.get('/items/:id', async (req, res) => {
            const ida = req.params.id;
            const query = { _id: new ObjectId(ida) }
            const result = await itemCollection.findOne(query)
            console.log(result)
            res.send(result)
        })
        //access logged in user crafts
        app.get('/myItems/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { user_email: email }
            const result = await itemCollection.find(query).toArray()
            res.send(result)
        })
        //added filter items
        app.get('/myItems/filter/:email/:fil', async (req, res) => {
            const email = req.params.email;
            const fil = req.params.fil;
            // console.log(email, fil)
            const query = { user_email: email, customization: fil }
            const result = await itemCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/categories', async(req, res)=>{
            const cursor = categoriesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/subCategory/:subCategory', async(req, res)=>{
            const subCategory = req.params.subCategory;
            const query = {subcategory_Name : subCategory}
            const cursor = itemCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateItem = req.body;
            const item = {
                $set: {
                    image: updateItem.image,
                    item_name: updateItem.item_name,
                    subcategory_Name: updateItem.subcategory_Name,
                    price: updateItem.price,
                    short_description: updateItem.short_description,
                    rating: updateItem.rating,
                    customization: updateItem.customization,
                    processing_time: updateItem.processing_time,
                    stock_status: updateItem.stock_status
                }
            }
            const result = await itemCollection.updateOne(filter, item, options)
            res.send(result)
        })

        app.delete('/myItems/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await itemCollection.deleteOne(query)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Art and craft server is running avishek')
})

app.listen(port, () => {
    console.log(`art craft server running ona: ${port}`)
})