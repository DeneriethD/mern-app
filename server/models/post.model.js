import mongoose from 'mongoose';


const require = 'field is required';

const PostSchema = new mongoose.Schema([{

    title: {
        type: String,
        trim: true,
        required: `Title ${require}`
    },

    photo: {
        data: Buffer,
        contentType: String
    },

    description:{
        type: String,
        trim: true,
        required: `Title ${require}`
    },

    user: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'}],
       
    created: {
        type: Date,
        default: Date.now
    },
   
    updated: Date, String,
   
    salt: String,
   
    comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comment', // Referencia al modelo de Comment
        },
      ],

    likes: [{ type: mongoose.Schema.Types.ObjectId,ref: 'User'}],
   

  }]);

export default mongoose.model('Post', PostSchema);