var mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    price: { type: String, required: true},
    category: { type: String, required: true},
    imagePath: { type: String, required: true}  
})

module.exports = mongoose.model('Product',productSchema);