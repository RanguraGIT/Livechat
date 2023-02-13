'use strict'

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const dotenv = require('dotenv')

const api = async () => {
    dotenv.config({ path: '../../.env' })

    const username = process.env.MONGO_USERNAME
    const password = process.env.MONGO_PASSWORD
    const cluster = process.env.MONGO_CLUSTER

    const path = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/?retryWrites=true&w=majority`
    return MongoClient.connect(path, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: { version: ServerApiVersion.v1 } })
}

const chatGroupCreate = (chatGroup) => {
    return new Promise(async (resolve, reject) => {
        let client, db, response

        console.log('Client is connecting to MongoDB Atlas chat database..')

        try {
            client = await api()
            db = client.db('chat')
            response = await db.collection('groups').insertOne(chatGroup)

            console.log('Client has connected to MongoDB Atlas and inserted a chat group into the chat database..')
            
            resolve(response.insertedId.toString())
        } catch (error) {
            reject(error)
        } finally {
            client.close()
        }

        console.log('Client has disconnected from MongoDB Atlas chat database..')
    })
}

const chatPersonalCreate = (chatPersonal) => {
    return new Promise(async (resolve, reject) => {
        let client, db, response

        console.log('Client is connecting to MongoDB Atlas chat database..')

        try {
            client = await api()
            db = client.db('chat')
            response = await db.collection('personals').insertOne(chatPersonal)

            console.log('Client has connected to MongoDB Atlas and inserted a chat personal into the chat database..')

            resolve(response.insertedId.toString())
        } catch (error) {
            reject(error)
        }

        console.log('Client has disconnected from MongoDB Atlas chat database..')
    })
}

const dataChat = {
    user_id: '5f9f1b9b0b9b9c0b9b0b9b0b',
    message: 'Hello World!',
    created_at: new Date()
}

chatGroupCreate(dataChat)