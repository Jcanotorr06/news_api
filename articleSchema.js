const mongoose = require('mongoose')

const ArticleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    categories: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Article', ArticleSchema);