import mongoose from 'mongoose'

export async function connectDB(){
    if(mongoose.connections[0].readyState){
        console.log('existing connection available')
        return
    }
    const MONGO_URI =  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.8fj8q2w.mongodb.net/?retryWrites=true&w=majority
    `
    try {
        await mongoose.connect(MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('connected to mongodb database')
    } catch (error) {
        console.error(error)
        
    }
}

export async function disconnectDB(){
    if(mongoose.connections[0].readyState){
        await mongoose.disconnect()
        console.log('mongodb disconnected')
        return
    }     
}


