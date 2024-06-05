import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://migueamores:UfUaeVd2lmYOY5sj@cluster0.jyji24b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("sample_mflix");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return database.collection("movies");
  } catch (error) {
    console.error("Error connecting to the database");
    console.error(error);
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export class MovieModel {
  static async getAll({ genre }) {
    const db = await connect();

    if (genre) {
      return db
        .find(
          {
            genres: {
              $elemMatch: {
                $regex: genre,
                $options: "i",
              },
            },
          },
          { limit: 5 }
        )
        .toArray();
    }

    return db.find({}, { limit: 10 }).toArray();
  }

  static async getById({ id }) {
    const db = await connect();
    const objectId = ObjectId.createFromHexString(id);
    return db.findOne({ _id: objectId });
  }

  static async create({ input }) {
    const db = await connect();

    const { insertedId } = await db.insertOne(input);

    return { id: insertedId, ...input };
  }

  static async update({ id, input }) {
    const db = await connect();
    const objectId = ObjectId.createFromHexString(id);

    const result = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: input },
      { returnDocument: "after" }
    );

    if (result == null) return false;

    return result;
  }

  static async delete({ id }) {
    const db = await connect();
    const objectId = ObjectId.createFromHexString(id);

    const { deletedCount } = await db.deleteOne({ _id: objectId });

    return deletedCount > 0;
  }
}
