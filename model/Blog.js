 const mongoose= require('mongoose');

 const BlogSchema= new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
        min :4,
    },
    desc:{
        type:String,
        required:true,
        min:12,
    },
    photo:{
        type:String,
        required: true,
    },
    categories:{
        type:Array,
        default:[]
    },
    status: {
        type: String,
        enum: ['published', 'draft'], // Specify the allowed status values
        default: 'draft', // Set the default status to 'draft'
    },
 },{timestamps: true})

module.exports = mongoose.model('Blog', BlogSchema)