
import mongoose from 'mongoose';

const require = 'field is required';


const ProductSchema = new mongoose.Schema([{ 
    
    name: {
        type: String,
        trim: true,
        required: `Name ${require}`

    },

    price: {
        type: Number,
        trim: true,
        required: `Price ${require}`

    },

    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
    },
    
    created: {
        type: Date,
        default: Date.now 
    },
    
    updated: Date,


}]);


export default mongoose.model('Product', ProductSchema);
