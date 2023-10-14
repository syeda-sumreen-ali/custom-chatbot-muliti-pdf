import SourceFileModel from "../../src/models/source-file.model"
import { getCompletion, getEmbeddings } from "../../src/services/openai-services"
import pinecone, { initialize } from "../../src/services/pinecone"

export default async function handler ( req, res){
    //1. check if post call
    if(req.method !=="POST"){
        return res.status(400).json({
            message:"Invalid request"
        })
    }
    //2. connect to mongodb
    const {id, query}= req.body
    //3. query the model by id
    await connectDB()
    const myFile = await SourceFileModel.findById(id)
    if(!myFile){
        return res.status(400).json({
            message:"Invalid file id"
        })
    }
    //4. get the embedding for the query 
    const queryEmbedding = await getEmbeddings(query)

    //5. initialize the pinecone
    await initialize()

    //6. connect to the index
    const index= await pinecone.Index(myFile.vectorIndex)
    
    //7. query the pinecone db and get the meta data from pinecone
    const queryRequest={
        vector: queryEmbedding,
        topK:5, //top 5 results
        includeValues:true,
        includeMetadata:true
    }

    const result = await index.query({queryRequest})
    // get the metadata from the pinecone results
    let contexts = result['matches'].map(item =>item['metadata'].text)
    // join results with line seperator
    contexts= contexts.join("\n\n-- \n\n")

    //8. build prompt with actual query string and pinecone returned metadata
    const promptStart = "Answer the question based on the context below: \n\n"
    const promptEnd= `\n\n Question: ${query} \n\nAnswer:`

    const prompt = `${promptStart} ${contexts} ${promptEnd}`
    
    //9. get the completion from openai
    let response = await getCompletion(prompt)

    //10. return the response to user  
    return res.status(200).json({response})
}