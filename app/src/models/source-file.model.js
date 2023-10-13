import mongoose from "mongoose";

const Schema = mongoose.Schema

const SourceFileSchema = new Schema({
    filename:{
        type:String,
        required:[true, 'filename is required'],
        maxLength:100,
        unique: true
    },
    fileUrl:{
        type:String,
        required:[true, 'filename is required'],
        maxLength:100,
        unique: true
    },
    isProcessed:{
        type:Boolean,
        default: false
    },
    vectorIndex:{
        type:String,
        maxLength:100,
        unique:true,
        required:true
    }
},{
    timestamps:true
})

const SourceFileModel= mongoose.model.sourceFile || mongoose.model("sourceFile", SourceFileSchema)