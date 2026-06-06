const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-node-cjs-runtime");
const uri = process.env.MONGODB_URI;

const port = process.env.PORT;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
);

const verifyToken = async (req, res, next) => {
  const header = req?.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log(token);
  try {
    const { payload } = await jwtVerify(token, JWKS);
    console.log(payload);
    next();
  } catch (error) {
    return res.status(403).json({ error: "Forbidden" });
  }
};

const normalizeFacility = (data) => ({
  ...data,
  price_per_hour: Number(data.price_per_hour),
  capacity: Number(data.capacity),
  available_slots: Array.isArray(data.available_slots)
    ? data.available_slots
    : [data.available_slots].filter(Boolean),
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("sportnest");
    const facilityCollection = db.collection("facilities");
    const bookingCollection = db.collection("bookings");

    app.post("/bookings", verifyToken, async (req, res) => {
      const bookingData = req.body;
      console.log(bookingData);
      const result = await bookingCollection.insertOne(bookingData);
      res.json(result);
    });

    app.get("/bookings/:userId", verifyToken, async (req, res) => {
      const { userId } = req.params;
      const cursor = bookingCollection.find({ userId: userId });
      const result = await cursor.toArray();
      res.json(result);
    });

    app.delete("/bookings/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });

    app.delete("/facilities/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await facilityCollection.deleteOne(query);
      res.json(result);
    });

    app.patch("/facilities/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const rest = { ...req.body };
      delete rest._id;
      const updateData = normalizeFacility(rest);

      const result = await facilityCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.json(result);
    });

    app.get("/facilities/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await facilityCollection.findOne(query);
      res.send(result);
    });

    app.get("/facilities", async (req, res) => {
      const { owner } = req.query;
      const query = owner ? { owner_email: owner } : {};
      const cursor = facilityCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/facilities", verifyToken, async (req, res) => {
      const facilityData = normalizeFacility(req.body);
      console.log(facilityData);
      const result = await facilityCollection.insertOne(facilityData);
      res.json(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
