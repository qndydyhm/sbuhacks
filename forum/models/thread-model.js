const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const ThreadSchema = new Schema(
    {
        title: { type: String, required: true },
        author: { type: ObjectId, required: true },
        category: { type: Boolean, required: true }, // false = cook, true = eat
        tags: { type: [String], required: true },
        images: { type: [ObjectId], required: true },
        content: { type: String, required: true }, 
        comments: { type: [ObjectId], required: true },
        favorited_by: { type: Number, required: true },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Thread', ThreadSchema);