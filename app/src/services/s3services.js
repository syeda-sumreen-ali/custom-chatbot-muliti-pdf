import AWS from 'aws-sdk'
import fs from "fs"

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_ID,
    secretAccessKey:process.env.S3_SECRET,
    region:process.env.S3_REGION
})

export const s3Upload = async (file) =>{
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key:file.name,
        Body: fs.createReadStream(file.path),
    }

    return await s3.upload(params).promise()
}