const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//MIDDLEWARE
app.use(cors());
app.use(express.json());

// AvishekRoy JbDmmHI7BojprzkP




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
        const passwordCollection = client.db('Password_Manager').collection('password');
        const itemCollection = client.db('itemsDB').collection('items');

        app.post('/saveCredentials', async (req, res) => {
            const addedItem = req.body;
            const result = await passwordCollection.insertOne(addedItem);
            res.send(result)
        })
        app.get('/myCredentials/:email', async (req, res) => {
            const email = req.params.email;
            console.log('email', email)
            const query = { user_email: email }
            const result = await passwordCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/selectedPlatform/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await passwordCollection.findOne(query)
            console.log('result', result)
            res.send(result)
        })

        app.put('/updateCredentials/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateInfo = req.body;
            const item = {
                $set: {
                    platform_name: updateInfo.platform_name,
                    platform_owner: updateInfo.platform_owner,
                    platform_email: updateInfo.platform_email,
                    platform_password: updateInfo.platform_password
                }
            }
            const result = await passwordCollection.updateOne(filter, item, options)
            res.send(result)
        })

        app.delete('/deletePlatformCredentials/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await passwordCollection.deleteOne(query)
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