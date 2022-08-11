const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ilfiw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try {
        await client.connect();
        const database = client.db('roomServices');
        const servicesCollection = database.collection('services');
        const galleryCollection = database.collection('gallery');
        const usersCollection = database.collection('users');

        // get services api
        app.get('/services', async (req, res) => {
            const services = servicesCollection.find({});
            const result = await services.toArray();
            res.send(result);
        });

        // get gallery api
        app.get('/gallery', async (req, res) => {
            const images = galleryCollection.find({});
            const result = await images.toArray();
            res.send(result);
        });

        // get users api
        app.get('/users', async (req, res) => {
            const userItem = usersCollection.find({});
            const result = await userItem.toArray();
            res.send(result);
        });

        // get single item api
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.findOne(query);
            res.json(result);
        });

        // post api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

        // delete single item api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {serviceId: id};
            const result = await usersCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Room Book Server Running');
});

app.listen(port, () => {
    console.log('Room book running port', port);
})