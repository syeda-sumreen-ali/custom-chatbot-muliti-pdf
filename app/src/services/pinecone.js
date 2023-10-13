import { PineconeClient } from "@pinecone-database/pinecone";

const pinecone = new PineconeClient();

export const initialize = async() =>{
     await pinecone.init({
        environment: process.env.PINECONE_DB_ENV,
        apiKey: process.env.PINECONE_DB_KEY
     })
}

export const createIndex= async(indexName)=>{
    const indexes = await pinecone.listIndexes(indexName)
    if(!indexes.includes(indexName)){
        await pinecone.createIndex({
            createRequest:{
                name: indexName,
                dimension:1536 // openai return by default 1536 dimension vector
            }
        })
    }else{
        throw new Error("Index with this name already exists")
    }
}

export default pinecone;