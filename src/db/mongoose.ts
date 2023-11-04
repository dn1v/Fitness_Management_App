import mongoose, { Mongoose } from "mongoose";

 export class Database {
    private mongoose: Mongoose
    private mongodbUrl: string | undefined

    constructor() {
        this.mongoose = mongoose
        this.mongodbUrl = process.env.MONGODB_URL
        this.databaseConnection()
        this.connectionMessage()
    }

    databaseConnection() {
        if (this.mongodbUrl) this.mongoose.connect(this.mongodbUrl)
        else console.log("MongoDB URL does not exist.")
    }

    connectionMessage() {
        this.mongoose.connection.once('open', () => {
            console.log('MongoDB database connection established successfully');
        })

        this.mongoose.connection.on('error', (error) => {
            console.error('Error connecting to MongoDB database: ', error);
        })
    }

}