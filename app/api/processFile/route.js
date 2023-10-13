export default function handler (req, res){
    //1. check for a POST call
    //2. connect to mongodb
    //3.query by file id
    // 4. read the pdf file from s3 url and iterate through each page
    //5. get the embeddings for each page 
    //6. create an array named vector and push our vectors in that array
    //7. initialize pinecone
    //8. connect to the index
    //9. insert vector to the pinecone using pinecone upsert
    //10. update our file status processed to true

}