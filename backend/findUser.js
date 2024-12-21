const { MongoClient } = require("mongodb");

async function findUser() {
  const uri = "mongodb://localhost:27017"; // Update with your MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("horsesclub");
    const users = database.collection("users");

    const user = await users.findOne({ email: "dhnos@hotmail.com" });
    console.log(user);
  } finally {
    await client.close();
  }
}

findUser().catch(console.error);
