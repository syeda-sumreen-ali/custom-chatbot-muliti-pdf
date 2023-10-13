import { NextResponse } from "next/server";
import formidable from 'formidable-serverless';
import {connectDB} from "@/app/src/services/db";
import {s3Upload} from "@/app/src/services/s3services"
import slugify from "slugify";
import {initialize, createIndex} from "@/app/src/services/pinecone"
import SourceFileModal from "@/app/src/models/source-file.model"

// To handle a POST request to /api
export async function POST(request) {

  try {
    
    // connect database
    await connectDB()

    //parse incoming form data
    let form = new formidable.IncomingForm()
    form.parse(req, async(error, field, files)=>{
      if(error){
        return res.status(500).json({
          message:"failded to parse form data"
        })
      }
    
      const file = file.file
      if(!file){
        return res.status(400).json({
          message:'no file uploaded'
        })
      }

      let data = await s3Upload(process.env.S3_BUCKET, file)
      const fileNameNoExt = file.name.split(".")[0];
      const fileSlug = slugify(fileNameNoExt,{
        lower: true,
        strict: true
      })

      // initalize pinecone
      await initialize()

      // create a pinecone index
      await createIndex(fileSlug)

      //save the file details in mongodb
      const myFile = new SourceFileModal({
        fileName: file.name,
        fileUrl: data.Location,
        vectorIndex: fileSlug
      })
      await myFile.save()

      return res.status(200).json({
        message:"file uploaded and index created"
      })

    })

   
  } catch (error) {
       console.log("---error ---", e)
       return res.status(500).json({
        message: e.message
       })
  }
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}