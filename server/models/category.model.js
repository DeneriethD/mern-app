import mongoose from 'mongoose';


const require = 'field is required';

const CategorySchema = new mongoose.Schema([{

    name: {
        type: String,
        trim: true,
        required: `Name ${require}`
    },

    description:{
        type: String,
        trim: true,
        required: false
    },

    created: {
        type: Date,
        default: Date.now 
    },
    
    updated: Date,
    
  }]);

export default mongoose.model('Category', CategorySchema);




