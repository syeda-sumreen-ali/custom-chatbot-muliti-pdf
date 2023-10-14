import { connectDB } from "../../src/services/db";
import SourceFileModel from "../../src/models/source-file.model";

export default async function handler(req,res){
    try {
        await connectDB()
        const files= await SourceFileModel.find({})
        return res.json(files)
    } catch (error) {
        return res.status(500).json({
            message:"error fetching files"
        })
    }
}