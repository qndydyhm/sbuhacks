const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema(
    {
        forum: {type: ObjectId, require: true},
        author: {type: ObjectId, require: true},
        content: {type: String, require: true}
    },
    { timestamps: true }
)

module.exports = mongoose.model('Comment', CommentSchema);