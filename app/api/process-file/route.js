import { connectDB } from "../../src/services/db";
import SourceFileModal from "../../src/models/source-file.model";
import * as PDFJS from "pdfjs-dist/legacy/build/pdf";
import { getEmbeddings } from "../../src/services/openai-services";
import pinecone, { initialize } from "../../src/services/pinecone";

export default async function handler(req, res) {
    //1. check for a POST call
    if (req.method !== "POST") {
        return res.status(400).json({
            message: "Invalid request",
        });
    }
    try {
        //2. connect to mongodb
        await connectDB();

        //3.query by file id
        const { id } = req.body;
        const myFile = await SourceFileModal.findById(id);

        if (!myFile) {
            return res.status(400).json({
                message: "Invalid file",
            });
        }
        if (myFile.isProcessed) {
            return res.status(400).json({
                message: "gile is already processed",
            });
        }
        // 4. read the pdf file from s3 url and iterate through each page
        let vector = [];
        let myFileData = await fetch(myFile.fileUrl);

        if (myFileData.ok) {
            let pdfDoc = await PDFJS.getDocument(
                await myFileData.arrayBuffer()
            ).promise();
            const numPages = pdfDoc.numPages;

            for (let i = 0; i < numPages; i++) {
                let page = await pdfDoc.getPage(i + 1);
                let textContext = await page.getTextContext();
                const text = textContext.items.map((item) => item.str).join("");
            }

            //5. get the embeddings for each page
            const embedding = await getEmbeddings(text);
            //6. create an array named vector and push our vectors in that array
            vector.push({
                id: `page${i + 1}`,
                values: embedding,
                metadata: {
                    text,
                    pageNum: i + 1,
                },
            });
            //7. initialize pinecone
            await initialize();
            //8. connect to the index
            const index = pinecone.Index(myFile.vectorIndex);
            //9. insert vector to the pinecone using pinecone upsert
            await index.upsert({
                upsertRequest: {
                    vectors:vector,
                },
            });
            //10. update our file status processed to true
            myFile.isProcessed = true;
            await myFile.save();
            return res.status(201).json({
                message: "file processed successfully",
            });
        }else{
            res.status(500).json({
                message:"Error while proccessing file"
            })
        }
    } catch (error) { 
        res.status(500).json({
            message:error.message
        })
    }
}
;
