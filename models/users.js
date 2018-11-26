const slug = require('mongoose-slug-generator');
const mongoose = require('mongoose');
mongoose.plugin(slug);


let postSchema = new mongoose.Schema({
    
    // add 2 fields, login and register

    login: {
        type: String,
        required: true
    },
    register: {
        type: String,
        required: true
    },
   
    created_at: {
        type: Date,
        default: Date.now
    },
    
});

// EXAMPLE OF CUSTOM VALIDATOR TO MAKE SURE STRING IS MORE THAN 3 CHARACTERS

let UsersModel = mongoose.model('Post', postSchema);

module.exports = postModel;
