import { MongoClient } from "mongodb"

const uri =
  "mongodb+srv://srikartikey11:EieRjZCWMm8SQakp@cluster0.eq9opp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
